"use client";

import { ArrowUpRight, Code2, MessageSquare, PenTool } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentScore {
  id: string;
  date: string;
  type: "TECHNICAL" | "BEHAVIORAL" | "SYSTEM_DESIGN";
  jobTitle: string;
  score: number;
  duration: number;
  status: "COMPLETED" | "IN_PROGRESS" | "FAILED";
}

interface RecentScoresProps {
  scores?: RecentScore[];
}

const defaultScores: RecentScore[] = [
  {
    id: "1",
    date: "Dec 28, 2025",
    type: "TECHNICAL",
    jobTitle: "Senior Frontend Engineer",
    score: 88,
    duration: 45,
    status: "COMPLETED",
  },
  {
    id: "2",
    date: "Dec 26, 2025",
    type: "BEHAVIORAL",
    jobTitle: "Product Manager",
    score: 82,
    duration: 30,
    status: "COMPLETED",
  },
  {
    id: "3",
    date: "Dec 24, 2025",
    type: "SYSTEM_DESIGN",
    jobTitle: "Staff Engineer",
    score: 75,
    duration: 55,
    status: "COMPLETED",
  },
  {
    id: "4",
    date: "Dec 22, 2025",
    type: "TECHNICAL",
    jobTitle: "Backend Developer",
    score: 91,
    duration: 40,
    status: "COMPLETED",
  },
  {
    id: "5",
    date: "Dec 20, 2025",
    type: "BEHAVIORAL",
    jobTitle: "Engineering Manager",
    score: 78,
    duration: 35,
    status: "COMPLETED",
  },
];

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

function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-500";
  if (score >= 70) return "text-primary";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

export function RecentScores({ scores = defaultScores }: RecentScoresProps) {
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
          <Link href="/dashboard/interviews">
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
            {scores.map((score) => {
              const config = typeConfig[score.type];
              const Icon = config.icon;
              return (
                <TableRow
                  key={score.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="text-muted-foreground">
                    {score.date}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${config.color} gap-1`}
                    >
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {score.jobTitle}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {score.duration}m
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`text-lg font-bold ${getScoreColor(score.score)}`}
                    >
                      {score.score}
                    </span>
                    <span className="text-muted-foreground text-sm">/100</span>
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
