import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { type ConnectionState, useDeepgramSTT } from "@/hooks/useDeepgramSTT";

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

  // Connection
  connectionState: ConnectionState;
  connectSTT: () => Promise<void>;
  stopAllMedia: () => void;
}

// Composite hook for managing all interview media functionality
export const useInterviewMedia = (
  _interviewId: string,
): InterviewMediaState => {
  // Track connection state in ref to avoid stale closures
  const connectionStateRef = useRef<ConnectionState>("disconnected");

  // Audio playback
  const { playEncodedAudio, isPlaying, stop: stopAudio } = useAudioPlayer();

  // Speech-to-text
  const {
    connect: connectSTT,
    disconnect: disconnectSTT,
    sendAudio,
    connectionState,
    transcript,
    setTranscript,
  } = useDeepgramSTT();

  // Keep ref in sync with state
  useEffect(() => {
    connectionStateRef.current = connectionState;
  }, [connectionState]);

  // Audio recording with STT streaming
  const { startRecording, stopRecording, isRecording } = useAudioRecorder({
    onAudioData: (blob) => {
      // Use ref to avoid stale closure
      if (connectionStateRef.current === "connected") {
        sendAudio(blob);
      }
    },
  });

  // Toggle microphone, automatically connects to STT if not already connected
  const toggleMic = useCallback(async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      // Ensure STT connection before recording
      if (connectionState === "disconnected") {
        await connectSTT();
      }
      await startRecording();
    } catch (error) {
      toast.error("Microphone access denied or unavailable");
    }
  }, [isRecording, stopRecording, startRecording, connectionState, connectSTT]);

 // Stop all media streams and connections
  const stopAllMedia = useCallback(() => {
    stopAudio();
    stopRecording();
    disconnectSTT();
  }, [stopAudio, stopRecording, disconnectSTT]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      stopRecording();
      disconnectSTT();
    };
  }, [stopAudio, stopRecording, disconnectSTT]);

  return {
    isPlaying,
    playEncodedAudio,
    stopAudio,
    isRecording,
    toggleMic,
    stopRecording,
    transcript,
    setTranscript,
    connectionState,
    connectSTT,
    stopAllMedia,
  };
};
