"use client";

import { cn } from "@/lib/utils";

interface WaveformProps {
  isActive: boolean;
  className?: string;
  barCount?: number;
}

export function Waveform({ isActive, className, barCount = 32 }: WaveformProps) {
  return (
    <div className={cn("flex items-center justify-center gap-[2px]", className)}>
      {Array.from({ length: barCount }).map((_, i) => {
        const baseHeight = Math.sin((i / barCount) * Math.PI) * 100;
        const height = isActive ? 20 + baseHeight * 0.6 : 4;

        return (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full transition-all",
              isActive ? "bg-primary" : "bg-primary/30"
            )}
            style={{
              height: `${height}%`,
              maxHeight: "80px",
              minHeight: "4px",
              transitionDuration: isActive ? "150ms" : "300ms",
              transitionDelay: isActive ? `${i * 20}ms` : "0ms",
              opacity: isActive ? 0.4 + Math.sin((i / barCount) * Math.PI) * 0.6 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
}
