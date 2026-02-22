import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { type ConnectionState, useLiveSTT } from "@/hooks/useLiveSTT";

export type { ConnectionState };

export interface InterviewMediaState {
  isPlaying: boolean;
  playEncodedAudio: (audioUrl: string) => void;
  stopAudio: () => void;
  isRecording: boolean;
  toggleMic: () => Promise<void>;
  stopRecording: () => void;
  transcript: string;
  interimTranscript: string;
  setTranscript: React.Dispatch<React.SetStateAction<string>>;
  connectionState: ConnectionState;
  connectSTT: () => Promise<void>;
  stopAllMedia: () => void;
}

export interface InterviewMediaOptions {
  onSpeechEnd?: (finalTranscript: string) => void;
}

export const useInterviewMedia = (
  _interviewId: string,
  options?: InterviewMediaOptions,
): InterviewMediaState => {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const micEnabledRef = useRef(true);
  const prevIsPlayingRef = useRef(false);

  const {
    playEncodedAudio: rawPlay,
    isPlaying,
    stop: stopAudio,
  } = useAudioPlayer();

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
        options?.onSpeechEnd?.(trimmed);
      }
    },
    onSpeechStarted: () => setInterimTranscript(""),
  });

  useEffect(() => {
    if (isPlaying && !prevIsPlayingRef.current) {
      pauseMic();
    } else if (!isPlaying && prevIsPlayingRef.current) {
      if (micEnabledRef.current) {
        resumeMic();
      }
    }
    prevIsPlayingRef.current = isPlaying;
  }, [isPlaying, pauseMic, resumeMic]);

  const playEncodedAudio = useCallback(
    (audioUrl: string) => {
      rawPlay(audioUrl);
    },
    [rawPlay],
  );

  const connectSTT = useCallback(async () => {
    try {
      await connect();
      micEnabledRef.current = true;
    } catch (error) {
      toast.error("Failed to connect real-time transcription");
    }
  }, [connect]);

  const toggleMic = useCallback(async () => {
    if (connectionState !== "connected") {
      try {
        await connect();
        micEnabledRef.current = true;
      } catch (error) {
        toast.error("Microphone access denied or unavailable");
      }
      return;
    }

    if (isRecording) {
      pauseMic();
      micEnabledRef.current = false;
    } else {
      resumeMic();
      micEnabledRef.current = true;
    }
  }, [connectionState, isRecording, connect, pauseMic, resumeMic]);

  const stopAllMedia = useCallback(() => {
    stopAudio();
    disconnect();
    micEnabledRef.current = false;
  }, [stopAudio, disconnect]);

  return {
    isPlaying,
    playEncodedAudio,
    stopAudio,
    isRecording,
    toggleMic,
    stopRecording: disconnect,
    transcript,
    interimTranscript,
    setTranscript,
    connectionState,
    connectSTT,
    stopAllMedia,
  };
};
