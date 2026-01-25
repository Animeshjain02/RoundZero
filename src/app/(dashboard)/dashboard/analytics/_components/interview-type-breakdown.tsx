"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface TypeData {
  name: string;
  value: number;
  color: string;
}

interface InterviewTypeBreakdownProps {
  data?: TypeData[];
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
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center">
          <Skeleton className="h-[160px] w-[160px] rounded-full" />
        </div>
        <div className="mt-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
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
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Interview Types
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution by category
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          <p className="text-center">Complete interviews to see distribution</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function InterviewTypeBreakdown({
  data,
  isLoading,
}: InterviewTypeBreakdownProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Interview Types
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution by category
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value} interviews (
                          {Math.round((data.value / total) * 100)}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.value}</span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
