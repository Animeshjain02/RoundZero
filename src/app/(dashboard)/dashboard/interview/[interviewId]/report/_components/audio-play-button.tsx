"use client";

import { Pause, Play, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioPlayButtonProps {
  audioUrl: string | null;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  className?: string;
}

export function AudioPlayButton({
  audioUrl,
  size = "md",
  variant = "ghost",
  className,
}: AudioPlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const cleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      cleanup();
      return;
    }

    setIsLoading(true);
    audio.src = audioUrl;

    audio.oncanplaythrough = () => {
      setIsLoading(false);
      audio.play().catch(() => cleanup());
    };

    audio.onplay = () => {
      setIsPlaying(true);
      // Update progress
      progressIntervalRef.current = setInterval(() => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 100);
    };

    audio.onended = cleanup;
    audio.onerror = cleanup;
    audio.onpause = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };

    audio.load();
  }, [audioUrl, isPlaying, cleanup]);

  // Cleanup on unmount or when audioUrl changes to avoid stale state
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      cleanup();
    };
  }, [audioUrl, cleanup]);

  if (!audioUrl) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn(sizeClasses[size], "opacity-50", className)}
      >
        <Volume2 className={cn(iconSizes[size], "text-muted-foreground")} />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={togglePlay}
      className={cn(
        sizeClasses[size],
        "relative overflow-hidden transition-all duration-200",
        isPlaying && "bg-primary/10 text-primary",
        className,
      )}
    >
      {/* Progress ring */}
      {isPlaying && (
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 36 36"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-primary/20"
            strokeWidth="2"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-primary transition-all duration-100"
            strokeWidth="2"
            strokeDasharray={`${progress} 100`}
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Icon */}
      <span className="relative z-10">
        {isLoading ? (
          <span
            className={cn(
              iconSizes[size],
              "block animate-pulse rounded-full bg-primary/50",
            )}
          />
        ) : isPlaying ? (
          <Pause className={cn(iconSizes[size], "fill-current")} />
        ) : (
          <Play className={cn(iconSizes[size], "fill-current")} />
        )}
      </span>
    </Button>
  );
}
