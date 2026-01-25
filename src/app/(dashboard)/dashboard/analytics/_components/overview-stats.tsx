"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Target,
  Trophy,
  Video,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItem {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface OverviewStatsProps {
  stats?: {
    totalInterviews: number;
    avgScore: number | null;
    totalPracticeTime: number;
    completionRate: number;
    interviewsChange: number;
    scoreChange: number;
    timeChange: number;
    completionChange: number;
  };
  isLoading?: boolean;
}

function StatCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-linear-to-br from-card to-card/80">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewStats({ stats, isLoading }: OverviewStatsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const statItems: StatItem[] = [
    {
      title: "Total Interviews",
      value: stats.totalInterviews,
      change: stats.interviewsChange,
      changeLabel: "from last period",
      icon: <Video className="h-5 w-5" />,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Average Score",
      value: stats.avgScore !== null ? `${stats.avgScore}%` : "--",
      change: stats.scoreChange,
      changeLabel: "improvement",
      icon: <Target className="h-5 w-5" />,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      title: "Practice Time",
      value: `${stats.totalPracticeTime}h`,
      change: stats.timeChange,
      changeLabel: "hours more",
      icon: <Clock className="h-5 w-5" />,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      change: stats.completionChange,
      changeLabel: "from last period",
      icon: <Trophy className="h-5 w-5" />,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card
          key={stat.title}
          className="relative overflow-hidden border-border/50 bg-linear-to-br from-card to-card/80 hover:shadow-lg transition-all duration-300 group"
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 ${stat.iconBg} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-70 transition-opacity`}
          />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>
              </div>
              <div
                className={`h-10 w-10 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              {stat.change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${stat.change >= 0 ? "text-emerald-500" : "text-red-500"}`}
              >
                {stat.change >= 0 ? "+" : ""}
                {stat.change}%
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.changeLabel}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
