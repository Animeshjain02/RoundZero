import { useCallback, useEffect, useRef, useState } from "react";

// Audio recording configuration with fallback for Safari
const AUDIO_CONFIG = {
  PREFERRED_MIME_TYPES: ["audio/webm", "audio/mp4", "audio/ogg"] as const,
  /** Processing interval in ms. Verification of VAD happens this often. */
  TIME_SLICE_MS: 100,
  /** RMS threshold for speech detection (0.0 to 1.0). 0.02 is approx -34dB. */
  VAD_THRESHOLD: 0.02,
  /** Duration of silence (in ms) required to trigger auto-stop. */
  SILENCE_DURATION_MS: 1500,
  /** Minimum speech duration (in ms) to be considered a valid utterance. */
  MIN_UTTERANCE_MS: 500,
} as const;

// Get supported MIME type for the current browser
const getSupportedMimeType = (): string | undefined => {
  if (typeof MediaRecorder === "undefined") return undefined;
  return AUDIO_CONFIG.PREFERRED_MIME_TYPES.find((type) =>
    MediaRecorder.isTypeSupported(type),
  );
};

export interface AudioRecorderOptions {
  /** Callback fired when a complete utterance is detected and processed */
  onUtterance: (blob: Blob) => void;
}

export interface AudioRecorderState {
  isRecording: boolean;
  isSpeaking: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

// Hook for recording audio with client-side Voice Activity Detection
export const useAudioRecorder = ({
  onUtterance,
}: AudioRecorderOptions): AudioRecorderState => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const chunksRef = useRef<Blob[]>([]);
  const silenceStartRef = useRef<number | null>(null);
  const speechStartRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    cleanup();
    setIsRecording(false);
    setIsSpeaking(false);

    // Process remaining chunks if any (manual stop)
    if (chunksRef.current.length > 0) {
      const mimeType = getSupportedMimeType() || "audio/webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      // Only fire if we had speech
      if (speechStartRef.current) {
        onUtterance(blob);
      }
      chunksRef.current = [];
    }
  }, [cleanup, onUtterance]);

  const startRecording = useCallback(async () => {
    try {
      // Cleanup previous session
      cleanup();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup AudioContext for VAD
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.4;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      // Setup MediaRecorder
      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      speechStartRef.current = null;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // VAD Loop
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteTimeDomainData(dataArray);

        // Calculate RMS
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const x = (dataArray[i] - 128) / 128.0;
          sum += x * x;
        }
        const rms = Math.sqrt(sum / dataArray.length);

        const now = Date.now();

        if (rms > AUDIO_CONFIG.VAD_THRESHOLD) {
          // Speech detected
          if (!speechStartRef.current) {
            speechStartRef.current = now;
            setIsSpeaking(true);
            console.log("[VAD] Speaking started");
          }
          silenceStartRef.current = null;
        } else if (speechStartRef.current) {
          // Silence during speech
          if (!silenceStartRef.current) {
            silenceStartRef.current = now;
          } else {
            const silenceDuration = now - silenceStartRef.current;
            if (silenceDuration > AUDIO_CONFIG.SILENCE_DURATION_MS) {
              console.log("[VAD] Silence detected, stopping...");

              // Validate utterance length
              const utteranceDuration = now - speechStartRef.current;
              if (utteranceDuration > AUDIO_CONFIG.MIN_UTTERANCE_MS) {
                // Stop the recorder to finalize the file
                if (mediaRecorderRef.current?.state === "recording") {
                  mediaRecorderRef.current.requestData(); // Flush
                  mediaRecorderRef.current.stop();

                  // Wait for "stop" event or handle blobs immediately?
                  // MediaRecorder is async. Let's process immediately from chunks buffer.
                  // Wait, ondataavailable triggers *after* requestData/stop.
                  // The cleanest way is to trigger stopRecording which cleans up.

                  // We need to trigger extraction of FULL blob.
                  // We process chunksRef.current in 'stopRecording' but requestData() is needed to get the *last* chunk.
                  // The safe way is to call stopRecording() and let it handle the blob creation.
                  stopRecording();
                  return; // Exit loop
                }
              } else {
                // Too short, ignore
                chunksRef.current = [];
                speechStartRef.current = null;
                silenceStartRef.current = null;
                setIsSpeaking(false);
              }
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      mediaRecorder.start(AUDIO_CONFIG.TIME_SLICE_MS);
      setIsRecording(true);
      checkVolume();
    } catch (error) {
      console.error("[Audio Recorder] Error accessing microphone:", error);
      throw error;
    }
  }, [cleanup, stopRecording, onUtterance]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isRecording,
    isSpeaking,
    startRecording,
    stopRecording,
  };
};
