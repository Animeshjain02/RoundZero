"use client";

import { format, formatDuration, intervalToDuration } from "date-fns";
import {
  Briefcase,
  Calendar,
  Clock,
  Code2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InterviewSummaryProps {
  summary: string;
  jobTitle: string;
  type: string;
  experienceLevel: string;
  techStack: string[];
  durationSec: number;
  startedAt: Date;
}

const typeLabels: Record<string, string> = {
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
  SYSTEM_DESIGN: "System Design",
};

const levelLabels: Record<string, string> = {
  JUNIOR: "Junior",
  MID: "Mid-Level",
  SENIOR: "Senior",
};

export function InterviewSummary({
  summary,
  jobTitle,
  type,
  experienceLevel,
  techStack,
  durationSec,
  startedAt,
}: InterviewSummaryProps) {
  const duration = intervalToDuration({
    start: 0,
    end: durationSec * 1000,
  });

  const formattedDuration = formatDuration(duration, {
    format: ["hours", "minutes", "seconds"],
    zero: false,
  });

  const metaItems = [
    {
      icon: Briefcase,
      label: "Position",
      value: jobTitle,
      color: "text-blue-500",
    },
    {
      icon: Code2,
      label: "Type",
      value: typeLabels[type] || type,
      color: "text-emerald-500",
    },
    {
      icon: GraduationCap,
      label: "Level",
      value: levelLabels[experienceLevel] || experienceLevel,
      color: "text-violet-500",
    },
    {
      icon: Clock,
      label: "Duration",
      value: formattedDuration || "< 1 minute",
      color: "text-orange-500",
    },
    {
      icon: Calendar,
      label: "Date",
      value: format(new Date(startedAt), "MMM d, yyyy"),
      color: "text-pink-500",
    },
  ];

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="pb-4 bg-linear-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold">AI Summary</CardTitle>
            <CardDescription className="mt-0.5">
              Generated analysis of your interview performance
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Text */}
        <div className="relative pl-4 border-l-2 border-primary/30">
          <p className="text-sm text-foreground/85 leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {metaItems.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex flex-col gap-1.5 p-3 rounded-lg",
                "bg-muted/50 border border-border/40",
                "hover:bg-muted transition-colors duration-200",
              )}
            >
              <div className="flex items-center gap-1.5">
                <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-medium truncate" title={item.value}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        {techStack && techStack.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Technologies Covered
            </span>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
