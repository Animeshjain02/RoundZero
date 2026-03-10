import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { type ConnectionState, useLiveSTT } from "@/hooks/useLiveSTT";

export type { ConnectionState };

export interface InterviewMediaState {
  isPlaying: boolean;
  /** Ref-stable: safe to call from callbacks without stale closure concerns */
  playAudio: (audioUrl: string) => void;
  stopAudio: () => void;
  isRecording: boolean;
  toggleMic: () => Promise<void>;
  transcript: string;
  interimTranscript: string;
  clearTranscript: () => void;
  restoreTranscript: (text: string) => void;
  connectionState: ConnectionState;
  connectSTT: () => Promise<void>;
  stopAllMedia: () => void;
}

export interface InterviewMediaOptions {
  onSpeechEnd?: (finalTranscript: string) => void;
  isAssistantResponding?: boolean;
}

export const useInterviewMedia = (
  options?: InterviewMediaOptions,
): InterviewMediaState => {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const micEnabledRef = useRef(true);
  const prevIsAssistantBusyRef = useRef(false);

  // Stabilize callback refs to avoid stale closures in useLiveSTT
  const onSpeechEndRef = useRef(options?.onSpeechEnd);
  useEffect(() => {
    onSpeechEndRef.current = options?.onSpeechEnd;
  }, [options?.onSpeechEnd]);

  const {
    playEncodedAudio,
    isPlaying,
    stop: stopAudio,
  } = useAudioPlayer();

  // Ref-stable play function — safe to call from stale closures (e.g. onFinish)
  const playEncodedAudioRef = useRef(playEncodedAudio);
  useEffect(() => {
    playEncodedAudioRef.current = playEncodedAudio;
  }, [playEncodedAudio]);

  const playAudio = useCallback((audioUrl: string) => {
    playEncodedAudioRef.current(audioUrl);
  }, []);

  const {
    connectionState,
    isRecording,
    connect,
    disconnect,
    pauseMic,
    resumeMic,
  } = useLiveSTT({
    onInterimTranscript: (text) => setInterimTranscript(text),
    onFinalTranscript: (text) => {
      setTranscript(text);
      setInterimTranscript("");
    },
    onUtteranceEnd: (assembledTranscript) => {
      const trimmed = assembledTranscript.trim();
      if (trimmed) {
        setTranscript(trimmed);
        setInterimTranscript("");
        onSpeechEndRef.current?.(trimmed);
      }
    },
    onSpeechStarted: () => setInterimTranscript(""),
  });

  // Auto pause/resume mic when assistant is busy (playing audio or responding)
  useEffect(() => {
    const isAssistantBusy = isPlaying || !!options?.isAssistantResponding;

    if (isAssistantBusy && !prevIsAssistantBusyRef.current) {
      pauseMic();
    } else if (!isAssistantBusy && prevIsAssistantBusyRef.current) {
      if (micEnabledRef.current) {
        resumeMic();
      }
    }
    prevIsAssistantBusyRef.current = isAssistantBusy;
  }, [isPlaying, options?.isAssistantResponding, pauseMic, resumeMic]);

  // Shared connect helper to avoid duplicated logic
  const tryConnect = useCallback(
    async (errorMessage: string): Promise<boolean> => {
      try {
        await connect();
        micEnabledRef.current = true;
        return true;
      } catch {
        toast.error(errorMessage);
        return false;
      }
    },
    [connect],
  );

  const connectSTT = useCallback(
    () => tryConnect("Failed to connect real-time transcription").then(() => {}),
    [tryConnect],
  );

  const toggleMic = useCallback(async () => {
    if (connectionState !== "connected") {
      await tryConnect("Microphone access denied or unavailable");
      return;
    }

    if (isRecording) {
      pauseMic();
      micEnabledRef.current = false;
    } else {
      resumeMic();
      micEnabledRef.current = true;
    }
  }, [connectionState, isRecording, tryConnect, pauseMic, resumeMic]);

  const stopAllMedia = useCallback(() => {
    stopAudio();
    disconnect();
    micEnabledRef.current = false;
  }, [stopAudio, disconnect]);

  const clearTranscript = useCallback(() => setTranscript(""), []);
  const restoreTranscript = useCallback((text: string) => setTranscript(text), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      disconnect();
    };
  }, [stopAudio, disconnect]);

  return {
    isPlaying,
    playAudio,
    stopAudio,
    isRecording,
    toggleMic,
    transcript,
    interimTranscript,
    clearTranscript,
    restoreTranscript,
    connectionState,
    connectSTT,
    stopAllMedia,
  };
};
