"use client";

import {
  Bar,
  BarChart,
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

interface TimeData {
  week: string;
  technical: number;
  behavioral: number;
  systemDesign: number;
}

interface TimeSpentChartProps {
  data?: TimeData[];
  isLoading?: boolean;
}

const chartConfig = {
  technical: { label: "Technical", color: "var(--color-primary)" },
  behavioral: { label: "Behavioral", color: "#22c55e" },
  systemDesign: { label: "System Design", color: "#f97316" },
} satisfies ChartConfig;

function LoadingSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-28 mb-2" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="text-right">
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
        <div className="mt-4 flex items-center justify-center gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Time Invested
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Practice hours by week
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
          <p className="text-center">Complete interviews to see time data</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TimeSpentChart({ data, isLoading }: TimeSpentChartProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  const totalHours = data.reduce(
    (acc, d) => acc + d.technical + d.behavioral + d.systemDesign,
    0,
  );

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Time Invested
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Practice hours by week
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
            <p className="text-xs text-muted-foreground">total this month</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={2}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/50"
                vertical={false}
              />
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => `${value}h`}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="technical"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
                stackId="stack"
              />
              <Bar
                dataKey="behavioral"
                fill="#22c55e"
                radius={[0, 0, 0, 0]}
                stackId="stack"
              />
              <Bar
                dataKey="systemDesign"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                stackId="stack"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm">Technical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-sm">Behavioral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-sm">System Design</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
