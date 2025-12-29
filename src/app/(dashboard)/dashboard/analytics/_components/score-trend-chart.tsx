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

interface ScoreDataPoint {
  date: string;
  score: number;
  interviews: number;
}

interface ScoreTrendChartProps {
  data?: ScoreDataPoint[];
}

const defaultData: ScoreDataPoint[] = [
  { date: "Dec 1", score: 65, interviews: 2 },
  { date: "Dec 5", score: 72, interviews: 3 },
  { date: "Dec 8", score: 68, interviews: 2 },
  { date: "Dec 12", score: 75, interviews: 4 },
  { date: "Dec 15", score: 78, interviews: 3 },
  { date: "Dec 18", score: 82, interviews: 2 },
  { date: "Dec 22", score: 79, interviews: 3 },
  { date: "Dec 25", score: 85, interviews: 4 },
  { date: "Dec 28", score: 88, interviews: 3 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function ScoreTrendChart({ data = defaultData }: ScoreTrendChartProps) {
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
            +{trend} pts
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
