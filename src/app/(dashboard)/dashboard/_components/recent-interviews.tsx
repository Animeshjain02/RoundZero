"use client";

import {
  ChevronRight,
  Code2,
  MessageSquare,
  Plus,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface InterviewType {
  id: string | number;
  title: string;
  type: "Technical" | "Behavioral" | "System Design";
  score: number | null;
  date: string;
  duration: string;
  status: "completed" | "in_progress" | "scheduled";
}

interface RecentInterviewsProps {
  interviews?: InterviewType[];
  isLoading?: boolean;
}

const typeConfig = {
  Technical: {
    icon: Code2,
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
  },
  Behavioral: {
    icon: Users,
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-500",
  },
  "System Design": {
    icon: Target,
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500",
  },
};

function InterviewItem({ interview }: { interview: InterviewType }) {
  const config = typeConfig[interview.type];
  const Icon = config.icon;

  return (
    <Link href={`/dashboard/interview/${interview.id}`}>
      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer group">
        <div className="flex items-center gap-4">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${config.bgColor} ${config.textColor}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{interview.title}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{interview.type}</span>
              <span>•</span>
              <span>{interview.duration}</span>
              <span>•</span>
              <span>{interview.date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {interview.status === "completed" && interview.score !== null ? (
            <div className="text-right">
              <p className="text-lg font-bold">{interview.score}</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
          ) : interview.status === "in_progress" ? (
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-amber-600 border-0"
            >
              In Progress
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-blue-500/10 text-blue-600 border-0"
            >
              Scheduled
            </Badge>
          )}
          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <MessageSquare className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">No interviews yet</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        Start your first mock interview to see your progress here.
      </p>
      <Button asChild>
        <Link href="/dashboard/interview/create">
          <Plus className="h-4 w-4 mr-2" />
          Start First Interview
        </Link>
      </Button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="divide-y divide-border/50">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function RecentInterviews({
  interviews,
  isLoading,
}: RecentInterviewsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Interviews</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-1"
          asChild
        >
          <Link href="/dashboard/interviews">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSkeleton />
          ) : interviews && interviews.length > 0 ? (
            <div className="divide-y divide-border/50">
              {interviews.map((interview) => (
                <InterviewItem key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
