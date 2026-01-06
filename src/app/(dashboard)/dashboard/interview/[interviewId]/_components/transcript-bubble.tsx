"use client";

import { cn } from "@/lib/utils";

interface TranscriptBubbleProps {
  text: string;
  speaker: "ai" | "user";
  isLive?: boolean;
}

export function TranscriptBubble({
  text,
  speaker,
  isLive,
}: TranscriptBubbleProps) {
  const isAI = speaker === "ai";

  return (
    <div
      className={cn(
        "max-w-2xl mx-auto text-center px-6 py-4 rounded-2xl transition-all duration-300",
        isAI
          ? "bg-primary/5 border border-primary/10"
          : "bg-muted/50 border border-border/50",
        isLive && "ring-2 ring-primary/20",
      )}
    >
      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
        {isAI ? "AI Interviewer" : "You"}
        {isLive && (
          <span className="ml-2 inline-flex items-center gap-1 text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
        )}
      </p>
      <p className={cn("text-lg leading-relaxed", isLive && "text-foreground")}>
        "{text}"
        {isLive && (
          <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse" />
        )}
      </p>
    </div>
  );
}
