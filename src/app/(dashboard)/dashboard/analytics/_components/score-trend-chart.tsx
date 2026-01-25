"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface ScoreDataPoint {
  date: string;
  score: number;
  interviews: number;
}

interface ScoreTrendChartProps {
  data?: ScoreDataPoint[];
  isLoading?: boolean;
}

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

function LoadingSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline gap-2">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Score Trend</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your performance over time
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          <p>Complete interviews to see your score trend</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScoreTrendChart({ data, isLoading }: ScoreTrendChartProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  const avgScore = Math.round(
    data.reduce((acc, d) => acc + d.score, 0) / data.length,
  );
  const trend =
    data.length > 1 ? data[data.length - 1].score - data[0].score : 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Score Trend</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your performance over time
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">
            {trend >= 0 ? "+" : ""}
            {trend} pts
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold">{avgScore}</span>
          <span className="text-muted-foreground">avg score</span>
        </div>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/50"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
