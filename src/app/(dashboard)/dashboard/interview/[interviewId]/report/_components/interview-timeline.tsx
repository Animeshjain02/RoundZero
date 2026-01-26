"use client";

import { format } from "date-fns";
import { Bot, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface InterviewTimelineProps {
  messages: Message[];
  onNodeClick?: (messageId: string) => void;
}

export function InterviewTimeline({
  messages,
  onNodeClick,
}: InterviewTimelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter out system messages
  const conversationMessages = messages.filter((m) => m.role !== "system");

  const handleNodeClick = useCallback(
    (id: string) => {
      setActiveId(id);
      onNodeClick?.(id);
    },
    [onNodeClick],
  );

  if (conversationMessages.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Conversation Flow
        </CardTitle>
        <CardDescription>
          {conversationMessages.length} exchanges • Click to navigate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
        >
          <div className="flex items-center gap-1 min-w-max px-1 py-2">
            {conversationMessages.map((message, index) => {
              const isAI = message.role === "assistant";
              const isActive = activeId === message.id;
              const isFirst = index === 0;
              const isLast = index === conversationMessages.length - 1;

              return (
                <div key={message.id} className="flex items-center gap-1">
                  {/* Connector line (before) */}
                  {!isFirst && (
                    <div
                      className={cn(
                        "h-0.5 w-4 transition-colors duration-200",
                        isAI ? "bg-emerald-500/30" : "bg-violet-500/30",
                      )}
                    />
                  )}

                  {/* Node */}
                  <button
                    onClick={() => handleNodeClick(message.id)}
                    className={cn(
                      "group relative flex flex-col items-center gap-1.5 transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1",
                    )}
                  >
                    {/* Time marker */}
                    <span
                      className={cn(
                        "text-[10px] text-muted-foreground transition-colors",
                        isActive && "text-foreground font-medium",
                      )}
                    >
                      {format(new Date(message.createdAt), "h:mm")}
                    </span>

                    {/* Icon node */}
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                        "ring-2 ring-offset-2 ring-offset-background",
                        isAI
                          ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-500"
                          : "bg-violet-500/10 ring-violet-500/30 text-violet-500",
                        isActive &&
                          isAI &&
                          "bg-emerald-500/20 ring-emerald-500 scale-110",
                        isActive &&
                          !isAI &&
                          "bg-violet-500/20 ring-violet-500 scale-110",
                        "group-hover:scale-110",
                      )}
                    >
                      {isAI ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wider whitespace-nowrap",
                        isAI ? "text-emerald-500" : "text-violet-500",
                        isActive && "font-medium",
                      )}
                    >
                      {isAI ? "AI" : "You"}
                    </span>

                    {/* Tooltip preview */}
                    <div
                      className={cn(
                        "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg",
                        "bg-popover border border-border shadow-lg max-w-[200px]",
                        "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                        "transition-all duration-200 z-10",
                        "pointer-events-none",
                      )}
                    >
                      <p className="text-xs line-clamp-2">{message.content}</p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-border" />
                      </div>
                    </div>
                  </button>

                  {/* Connector line (after) */}
                  {!isLast && (
                    <div
                      className={cn(
                        "h-0.5 w-4 transition-colors duration-200",
                        isAI ? "bg-emerald-500/30" : "bg-violet-500/30",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
