import { useCallback, useEffect, useRef, useState } from "react";

// Default volume level
const DEFAULT_VOLUME = 1.0;

export interface AudioPlayerState {
  isPlaying: boolean;
  volume: number;
  playEncodedAudio: (audioUrl: string) => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

// Hook for playing audio from URLs
// Manages playback state and volume control
export const useAudioPlayer = (): AudioPlayerState => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playEncodedAudio = useCallback(
    (audioUrl: string) => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;

      // Stop current playback if any
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }

      audio.src = audioUrl;
      audio.volume = volume;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = (error) => {
        console.error("[Audio Player] Playback error:", error);
        setIsPlaying(false);
      };

      audio.play().catch((error) => {
        console.error("[Audio Player] Play error:", error);
        setIsPlaying(false);
      });
    },
    [volume],
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // Update volume on existing audio element when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isPlaying,
    playEncodedAudio,
    stop,
    volume,
    setVolume,
  };
};
