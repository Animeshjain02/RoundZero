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

interface SkillData {
  skill: string;
  current: number;
  previous: number;
}

interface SkillRadarChartProps {
  data?: SkillData[];
}

const defaultData: SkillData[] = [
  { skill: "Communication", current: 85, previous: 72 },
  { skill: "Problem Solving", current: 78, previous: 65 },
  { skill: "Technical Knowledge", current: 72, previous: 68 },
  { skill: "System Design", current: 65, previous: 55 },
  { skill: "Code Quality", current: 80, previous: 70 },
  { skill: "Time Management", current: 70, previous: 60 },
];

const chartConfig = {
  current: { label: "Current", color: "var(--color-primary)" },
  previous: { label: "Previous", color: "var(--color-muted-foreground)" },
} satisfies ChartConfig;

export function SkillRadarChart({ data = defaultData }: SkillRadarChartProps) {
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
