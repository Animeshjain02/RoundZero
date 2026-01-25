"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillData {
  skill: string;
  current: number;
  previous: number;
}

interface SkillRadarChartProps {
  data?: SkillData[];
  isLoading?: boolean;
}

const chartConfig = {
  current: { label: "Current", color: "var(--color-primary)" },
  previous: { label: "Previous", color: "var(--color-muted-foreground)" },
} satisfies ChartConfig;

function LoadingSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
        <div className="mt-2 flex items-center justify-center gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
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
          Skill Assessment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Current vs previous period
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p className="text-center">Complete interviews to see skills</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkillRadarChart({ data, isLoading }: SkillRadarChartProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.length === 0 || data.every((d) => d.current === 0)) {
    return <EmptyState />;
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Skill Assessment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Current vs previous period
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid className="stroke-border/50" gridType="polygon" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
              />
              <Radar
                name="Previous"
                dataKey="previous"
                stroke="var(--color-muted-foreground)"
                fill="var(--color-muted-foreground)"
                fillOpacity={0.1}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="font-medium">
                          {payload[0].payload.skill}
                        </p>
                        <p className="text-sm text-primary">
                          Current: {payload[0].payload.current}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Previous: {payload[0].payload.previous}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-2 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground/50" />
            <span className="text-sm">Previous</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
