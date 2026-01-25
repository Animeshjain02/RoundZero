import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { orpc, orpcClient } from "@/lib/orpc-client";

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "failed";

export interface InterviewMediaState {
  // Audio playback
  isPlaying: boolean;
  playEncodedAudio: (audioUrl: string) => void;
  stopAudio: () => void;

  // Recording
  isRecording: boolean;
  toggleMic: () => Promise<void>;
  stopRecording: () => void;

  // Transcription
  transcript: string;
  setTranscript: React.Dispatch<React.SetStateAction<string>>;

  // Connection (Mocked for interface compatibility)
  connectionState: ConnectionState;
  connectSTT: () => Promise<void>;
  stopAllMedia: () => void;
}

export interface InterviewMediaOptions {
  onSpeechEnd?: (finalTranscript: string) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result?.toString().split(",")[1];
      resolve(base64data || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Composite hook for managing all interview media functionality
// REFACTORED: Uses Client-side VAD + Server-side REST Transcription (Plan B)
export const useInterviewMedia = (
  _interviewId: string,
  options?: InterviewMediaOptions,
): InterviewMediaState => {
  const [transcript, setTranscript] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio playback
  const { playEncodedAudio, isPlaying, stop: stopAudio } = useAudioPlayer();

  // Transcription mutation
  const { mutateAsync: transcribe } = useMutation({
    mutationFn: async (blob: Blob) => {
      const base64 = await blobToBase64(blob);
      return orpcClient.media.transcribe({
        audio: base64,
        mimetype: blob.type || "audio/webm",
      });
    },
    onSuccess: (data) => {
      if (data.transcript) {
        console.log(
          "[Interview Media] Transcription success:",
          data.transcript,
        );
        setTranscript(data.transcript);
        options?.onSpeechEnd?.(data.transcript);
      } else {
        console.log("[Interview Media] Verified silence (empty transcript)");
      }
    },
    onError: (error) => {
      console.error("[Interview Media] Transcription error:", error);
      toast.error("Failed to process speech");
    },
  });

  // Audio recording with VAD
  const { startRecording, stopRecording, isRecording } = useAudioRecorder({
    onUtterance: async (blob) => {
      console.log("[Interview Media] VAD detected utterance, size:", blob.size);
      setIsProcessing(true);
      try {
        await transcribe(blob);
      } finally {
        setIsProcessing(false);
      }
    },
  });

  // Toggle microphone
  const toggleMic = useCallback(async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      console.log("[Interview Media] Starting VAD recording...");
      await startRecording();
    } catch (error) {
      console.error("[Interview Media] Mic error:", error);
      toast.error("Microphone access denied or unavailable");
    }
  }, [isRecording, stopRecording, startRecording]);

  // Stop all media streams
  const stopAllMedia = useCallback(() => {
    stopAudio();
    stopRecording();
  }, [stopAudio, stopRecording]);

  return {
    isPlaying,
    playEncodedAudio,
    stopAudio,
    isRecording,
    toggleMic,
    stopRecording,
    transcript: isProcessing ? "Processing speech..." : transcript,
    setTranscript,
    // Simulate connection state for UI compatibility
    connectionState: "connected",
    connectSTT: async () => {}, // No-op
    stopAllMedia,
  };
};
