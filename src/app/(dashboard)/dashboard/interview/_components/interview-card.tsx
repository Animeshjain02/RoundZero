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
import type { InterviewItem } from "@/server/routers/interview/interview.schemas";

interface InterviewCardProps {
  interview: InterviewItem;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const isCompleted = interview.status === "COMPLETED";
  const isInProgress = interview.status === "IN_PROGRESS";

  // Status config
  const statusConfig = {
    COMPLETED: {
      label: "Completed",
      className:
        "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className:
        "bg-blue-500/15 text-blue-600 border-blue-500/20 hover:bg-blue-500/25",
    },
    FAILED: {
      label: "Failed",
      className:
        "bg-red-500/15 text-red-600 border-red-500/20 hover:bg-red-500/25",
    },
    SETUP: {
      label: "Setup",
      className:
        "bg-orange-500/15 text-orange-600 border-orange-500/20 hover:bg-orange-500/25",
    },
  };

  const currentStatus =
    statusConfig[interview.status as keyof typeof statusConfig] ||
    statusConfig.SETUP;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
        <CardHeader className="p-5 pb-3 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Badge
                variant="outline"
                className={cn(
                  "mb-2 transition-colors",
                  currentStatus.className,
                )}
              >
                {currentStatus.label}
              </Badge>
              <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                {interview.jobTitle}
              </h3>
            </div>
            {isCompleted && interview.score !== null && (
              <div className="flex flex-col items-end">
                <div
                  className={cn(
                    "flex items-center gap-1.5 font-bold text-lg",
                    interview.score >= 80
                      ? "text-emerald-600"
                      : interview.score >= 60
                        ? "text-yellow-600"
                        : "text-red-600",
                  )}
                >
                  <Trophy className="h-4 w-4" />
                  <span>{interview.score}</span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Score
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 py-2 grow">
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {formatDistanceToNow(new Date(interview.startedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>{Math.round(interview.durationSec / 60)} min</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-3 mt-auto">
          {isCompleted ? (
            <Button asChild className="w-full group/btn" variant="outline">
              <Link href={`/dashboard/interview/${interview.id}/report`}>
                <BarChart2 className="mr-2 h-4 w-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                View Detailed Report
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
              </Link>
            </Button>
          ) : (
            <Button asChild className="w-full" variant="default">
              <Link href={`/dashboard/interview/${interview.id}`}>
                Continue Interview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
