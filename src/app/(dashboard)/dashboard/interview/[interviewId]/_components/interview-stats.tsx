"use client";

import { CheckCircle2, Circle, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InterviewStatsProps {
  questionsAnswered: number;
  totalQuestions: number;
  currentTopic: string;
  techStack: string[];
  className?: string;
}

export function InterviewStats({
  questionsAnswered,
  totalQuestions,
  currentTopic,
  techStack,
  className,
}: InterviewStatsProps) {
  const progress = (questionsAnswered / totalQuestions) * 100;

  return (
    <div className={cn("flex items-center gap-6 text-sm", className)}>
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div key={i}>
              {i < questionsAnswered ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : i === questionsAnswered ? (
                <HelpCircle className="h-4 w-4 text-primary animate-pulse" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/30" />
              )}
            </div>
          ))}
        </div>
        <span className="text-muted-foreground">
          {questionsAnswered}/{totalQuestions}
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border" />

      {/* Current topic */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Topic:</span>
        <Badge variant="secondary" className="font-normal">
          {currentTopic}
        </Badge>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border" />

      {/* Tech stack */}
      <div className="flex items-center gap-2">
        {techStack.slice(0, 3).map((tech) => (
          <Badge key={tech} variant="outline" className="text-xs font-normal">
            {tech}
          </Badge>
        ))}
        {techStack.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{techStack.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}
