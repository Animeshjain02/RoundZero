"use client";

import { Clock, Target, TrendingUp, Trophy, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    label: string;
    isPositive?: boolean;
  };
  iconColor?: string;
  glowColor?: string;
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  icon,
  trend,
  iconColor = "text-primary",
  glowColor = "from-primary/20",
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-border/50 bg-linear-to-br from-card to-card/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Skeleton className="h-9 w-9 rounded-xl" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-border/50 bg-linear-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300 group">
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${glowColor} to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-80 transition-opacity`}
      />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`h-9 w-9 rounded-xl bg-current/10 flex items-center justify-center ${iconColor}`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            {trend.isPositive !== false ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
            )}
            <span
              className={`text-xs font-medium ${trend.isPositive !== false ? "text-emerald-500" : "text-red-500"}`}
            >
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-xs text-muted-foreground">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStats {
  totalSessions: number;
  completedCount: number;
  averageScore: number | null;
  totalDurationSec: number;
}

interface StatsCardsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  // Format duration from seconds to hours with 1 decimal
  const practiceHours = stats
    ? Math.round((stats.totalDurationSec / 3600) * 10) / 10
    : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Sessions"
        value={stats?.totalSessions ?? 0}
        icon={<Video className="h-4 w-4" />}
        trend={{
          value: "+0", // Placeholder as API doesn't provide growth yet
          label: "this week",
          isPositive: true,
        }}
        iconColor="text-primary"
        glowColor="from-primary/20"
        isLoading={isLoading}
      />
      <StatCard
        title="Average Score"
        value={stats?.averageScore ?? "--"}
        icon={<Target className="h-4 w-4" />}
        trend={{ value: "+0", label: "improvement", isPositive: true }} // Placeholder
        iconColor="text-emerald-500"
        glowColor="from-emerald-500/20"
        isLoading={isLoading}
      />
      <StatCard
        title="Practice Time"
        value={`${practiceHours}h`}
        icon={<Clock className="h-4 w-4" />}
        trend={{
          value: "0 day streak", // Placeholder
          label: "",
          isPositive: true,
        }}
        iconColor="text-orange-500"
        glowColor="from-orange-500/20"
        isLoading={isLoading}
      />
      <StatCard
        title="Skills Mastered"
        value={0} // Placeholder
        icon={<Trophy className="h-4 w-4" />}
        trend={{ value: "0 new", label: "this month", isPositive: true }}
        iconColor="text-violet-500"
        glowColor="from-violet-500/20"
        isLoading={isLoading}
      />
    </div>
  );
}
