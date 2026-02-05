"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Calendar, Clock, Trophy } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InterviewItem } from "@/server/routers/interview/schemas";

interface InterviewCardProps {
  interview: InterviewItem;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const isCompleted = interview.status === "COMPLETED";

  // Status config
  const statusConfig = {
    COMPLETED: {
      label: "Completed",
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    FAILED: {
      label: "Failed",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    SETUP: {
      label: "Setup",
      className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },
  };

  const currentStatus =
    statusConfig[interview.status as keyof typeof statusConfig] ||
    statusConfig.SETUP;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="group relative h-full flex flex-col border-border/40 bg-background/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

        <CardHeader className="p-6 pb-2 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 min-w-0">
              <Badge
                variant="outline"
                className={cn(
                  "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                  currentStatus.className,
                )}
              >
                {currentStatus.label}
              </Badge>
              <h3 className="font-bold text-xl leading-snug tracking-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {interview.jobTitle}
              </h3>
            </div>

            {isCompleted && interview.score !== null && (
              <div className="flex flex-col items-center shrink-0 p-3 rounded-2xl bg-secondary/30 border border-border/40 backdrop-blur-md">
                <span
                  className={cn(
                    "text-2xl font-black tabular-nums tracking-tighter",
                    interview.score >= 80
                      ? "text-emerald-500"
                      : interview.score >= 60
                        ? "text-yellow-500"
                        : "text-red-500",
                  )}
                >
                  {interview.score}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                  Score
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 py-4 grow">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground/80 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50 border border-border/40">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="truncate">
                {formatDistanceToNow(new Date(interview.startedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground/80 font-medium">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50 border border-border/40">
                <Clock className="h-4 w-4" />
              </div>
              <span>
                {Math.round(interview.durationSec / 60)} minutes session
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-2 mt-auto">
          {isCompleted ? (
            <Button
              asChild
              className="w-full group/btn h-11 rounded-xl bg-secondary/50 hover:bg-primary hover:text-primary-foreground border-border/40 hover:border-primary transition-all duration-300"
              variant="outline"
            >
              <Link href={`/dashboard/interview/${interview.id}/report`}>
                <BarChart2 className="mr-2 h-4 w-4" />
                <span className="font-semibold">Analyze Report</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 active:scale-[0.98]"
              variant="default"
            >
              <Link href={`/dashboard/interview/${interview.id}`}>
                <span className="font-semibold">Resume Interview</span>
                <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
