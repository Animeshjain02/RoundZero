"use client";

import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Code2, MessageSquare, PenTool } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orpc } from "@/lib/orpc-client";
import { useQuery } from "@tanstack/react-query";

interface RecentScoresProps {
  isLoading?: boolean;
}

const typeConfig = {
  TECHNICAL: {
    icon: Code2,
    label: "Technical",
    color: "bg-primary/10 text-primary",
  },
  BEHAVIORAL: {
    icon: MessageSquare,
    label: "Behavioral",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  SYSTEM_DESIGN: {
    icon: PenTool,
    label: "System Design",
    color: "bg-orange-500/10 text-orange-500",
  },
};

function getScoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 85) return "text-emerald-500";
  if (score >= 70) return "text-primary";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

function LoadingSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <Skeleton className="h-5 w-36 mb-2" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Recent Interviews
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your latest interview scores
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          <p className="text-center">No interviews yet. Start practicing!</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentScores({ isLoading: parentLoading }: RecentScoresProps) {
  // Fetch recent interviews using interview.list API
  const queryOptions = useMemo(
    () =>
      orpc.interview.list.queryOptions({
        input: { limit: 5, status: "COMPLETED" },
        staleTime: 1000 * 60 * 5, // 5 minutes
      }),
    [],
  );

  const { data, isLoading } = useQuery(queryOptions);

  if (parentLoading || isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data?.interviews || data.interviews.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Recent Interviews
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your latest interview scores
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/interview">
            View all
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-center">Duration</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.interviews.map((interview) => {
              const config =
                typeConfig[interview.type as keyof typeof typeConfig];
              const Icon = config?.icon || Code2;
              return (
                <TableRow
                  key={interview.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(interview.startedAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${config?.color || "bg-primary/10 text-primary"} gap-1`}
                    >
                      <Icon className="h-3 w-3" />
                      {config?.label || interview.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {interview.jobTitle}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {Math.floor(interview.durationSec / 60)}m
                  </TableCell>
                  <TableCell className="text-right">
                    {interview.score !== null ? (
                      <>
                        <span
                          className={`text-lg font-bold ${getScoreColor(interview.score)}`}
                        >
                          {interview.score}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          /100
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
