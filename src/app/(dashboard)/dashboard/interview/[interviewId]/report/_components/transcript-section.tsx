"use client";

import { format } from "date-fns";
import { Bot, ChevronDown, ChevronUp, Clock, User } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { AudioPlayButton } from "./audio-play-button";

interface Message {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  audioUrl: string | null;
  createdAt: Date;
}

interface TranscriptSectionProps {
  messages: Message[];
}

interface QAPair {
  question: Message;
  answer: Message | null;
  index: number;
}

function parseQAPairs(messages: Message[]): QAPair[] {
  const pairs: QAPair[] = [];
  // Filter out system messages
  const conversationMessages = messages.filter((m) => m.role !== "system");

  for (let i = 0; i < conversationMessages.length; i++) {
    const msg = conversationMessages[i];
    if (msg.role === "assistant") {
      // Look for the next user message
      const nextUserMsg = conversationMessages[i + 1];
      pairs.push({
        question: msg,
        answer: nextUserMsg?.role === "user" ? nextUserMsg : null,
        index: pairs.length,
      });
      if (nextUserMsg?.role === "user") {
        i++; // Skip the user message since we paired it
      }
    }
  }

  return pairs;
}

function QAPairCard({ pair }: { pair: QAPair }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn(
          "group relative rounded-xl border transition-all duration-300",
          "bg-linear-to-br from-card to-card/50",
          "hover:shadow-lg hover:shadow-primary/5",
          isOpen && "ring-1 ring-primary/10",
        )}
      >
        {/* Question Number Badge */}
        <div className="absolute -left-3 top-4 z-10">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-lg">
            {pair.index + 1}
          </div>
        </div>

        {/* AI Question */}
        <div className="border-b border-border/50 p-4 pl-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <Bot className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">
                  AI Question
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {format(new Date(pair.question.createdAt), "h:mm a")}
                </div>
              </div>
              <CollapsibleTrigger className="flex w-full items-start justify-between text-left">
                <p
                  className={cn(
                    "text-sm text-foreground/90 leading-relaxed pr-2",
                    !isOpen && "line-clamp-2",
                  )}
                >
                  {pair.question.content}
                </p>
                <span className="shrink-0 ml-2 mt-0.5 text-muted-foreground">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </span>
              </CollapsibleTrigger>
            </div>
            <AudioPlayButton
              audioUrl={pair.question.audioUrl}
              size="sm"
              className="shrink-0"
            />
          </div>
        </div>

        {/* User Answer */}
        <CollapsibleContent>
          <div className="p-4 pl-6 bg-muted/30">
            {pair.answer ? (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                  <User className="h-4 w-4 text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-violet-500 uppercase tracking-wider">
                      Your Answer
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(pair.answer.createdAt), "h:mm a")}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {pair.answer.content || (
                      <span className="italic text-muted-foreground">
                        No response recorded
                      </span>
                    )}
                  </p>
                </div>
                <AudioPlayButton
                  audioUrl={pair.answer.audioUrl}
                  size="sm"
                  className="shrink-0"
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic pl-11">
                Awaiting response...
              </p>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function TranscriptSection({ messages }: TranscriptSectionProps) {
  const qaPairs = parseQAPairs(messages);

  if (qaPairs.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Interview Transcript
          </CardTitle>
          <CardDescription>No conversation recorded yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Interview Transcript
            </CardTitle>
            <CardDescription className="mt-1">
              {qaPairs.length} question{qaPairs.length !== 1 ? "s" : ""} •
              Replay the conversation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-primary/20 via-primary/10 to-transparent" />

          {qaPairs.map((pair) => (
            <QAPairCard key={pair.question.id} pair={pair} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
