import { useCallback, useEffect, useRef, useState } from "react";

// Audio recording configuration with fallback for Safari
const AUDIO_CONFIG = {
  PREFERRED_MIME_TYPES: ["audio/webm", "audio/mp4", "audio/ogg"] as const,
  TIME_SLICE_MS: 250, // Send audio chunks every 250ms for streaming
} as const;

// Get supported MIME type for the current browser
const getSupportedMimeType = (): string | undefined => {
  if (typeof MediaRecorder === "undefined") return undefined;
  return AUDIO_CONFIG.PREFERRED_MIME_TYPES.find((type) =>
    MediaRecorder.isTypeSupported(type),
  );
};

export interface AudioRecorderOptions {
  onAudioData: (blob: Blob) => void;
  silenceThresholdMs?: number;
}

export interface AudioRecorderState {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

// Hook for recording audio from the microphone
// Streams audio data in chunks for real-time processing
export const useAudioRecorder = ({
  onAudioData,
}: AudioRecorderOptions): AudioRecorderState => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onAudioData(event.data);
        }
      };

      // Start recording with time slicing for streaming
      mediaRecorder.start(AUDIO_CONFIG.TIME_SLICE_MS);
      setIsRecording(true);
    } catch (error) {
      console.error("[Audio Recorder] Error accessing microphone:", error);
      throw error;
    }
  }, [onAudioData]);

  const stopRecording = useCallback(() => {
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

    setIsRecording(false);
  }, []);

  // Cleanup on unmount - use refs to avoid dependency issues
  useEffect(() => {
    const mediaRecorderRefCurrent = mediaRecorderRef;
    const streamRefCurrent = streamRef;

    return () => {
      if (
        mediaRecorderRefCurrent.current &&
        mediaRecorderRefCurrent.current.state !== "inactive"
      ) {
        mediaRecorderRefCurrent.current.stop();
      }
      if (streamRefCurrent.current) {
        streamRefCurrent.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};
