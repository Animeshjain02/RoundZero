"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

interface ScoreData {
  category: string;
  score: number;
}

interface ReportRadarChartProps {
  data: ScoreData[];
}

const chartConfig = {
  score: { label: "Score", color: "var(--color-primary)" },
} satisfies ChartConfig;

export function ReportRadarChart({ data }: ReportRadarChartProps) {
  return (
    <Card className="border-border/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Category Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed analysis of your performance
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid className="stroke-border/50" gridType="polygon" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
                tickCount={6}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
