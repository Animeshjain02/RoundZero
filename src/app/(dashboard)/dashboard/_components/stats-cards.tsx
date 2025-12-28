"use client";

import { Clock, Target, TrendingUp, Trophy, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

function StatCard({
  title,
  value,
  icon,
  trend,
  iconColor = "text-primary",
  glowColor = "from-primary/20",
}: StatCardProps) {
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

interface StatsCardsProps {
  stats?: {
    totalSessions: number;
    averageScore: number | null;
    practiceTime: number;
    skillsMastered: number;
    weeklyGrowth?: number;
    streak?: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  // TODO: we will replace this mock values with actual data
  const data = stats || {
    totalSessions: 12,
    averageScore: 8.4,
    practiceTime: 6.5,
    skillsMastered: 7,
    weeklyGrowth: 3,
    streak: 5,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Sessions"
        value={data.totalSessions}
        icon={<Video className="h-4 w-4" />}
        trend={{
          value: `+${data.weeklyGrowth || 0}`,
          label: "this week",
          isPositive: true,
        }}
        iconColor="text-primary"
        glowColor="from-primary/20"
      />
      <StatCard
        title="Average Score"
        value={data.averageScore ?? "--"}
        icon={<Target className="h-4 w-4" />}
        trend={{ value: "+0.6", label: "improvement", isPositive: true }}
        iconColor="text-emerald-500"
        glowColor="from-emerald-500/20"
      />
      <StatCard
        title="Practice Time"
        value={`${data.practiceTime}h`}
        icon={<Clock className="h-4 w-4" />}
        trend={{
          value: `${data.streak || 0} day streak`,
          label: "",
          isPositive: true,
        }}
        iconColor="text-orange-500"
        glowColor="from-orange-500/20"
      />
      <StatCard
        title="Skills Mastered"
        value={data.skillsMastered}
        icon={<Trophy className="h-4 w-4" />}
        trend={{ value: "2 new", label: "this month", isPositive: true }}
        iconColor="text-violet-500"
        glowColor="from-violet-500/20"
      />
    </div>
  );
}
