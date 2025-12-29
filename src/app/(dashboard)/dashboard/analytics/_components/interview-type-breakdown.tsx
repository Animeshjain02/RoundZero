"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

interface TypeData {
  name: string;
  value: number;
  color: string;
}

interface InterviewTypeBreakdownProps {
  data?: TypeData[];
}

const defaultData: TypeData[] = [
  { name: "Technical", value: 12, color: "var(--color-primary)" },
  { name: "Behavioral", value: 7, color: "#22c55e" },
  { name: "System Design", value: 5, color: "#f97316" },
];

const chartConfig = {
  technical: { label: "Technical", color: "var(--color-primary)" },
  behavioral: { label: "Behavioral", color: "#22c55e" },
  systemDesign: { label: "System Design", color: "#f97316" },
} satisfies ChartConfig;

export function InterviewTypeBreakdown({
  data = defaultData,
}: InterviewTypeBreakdownProps) {
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
