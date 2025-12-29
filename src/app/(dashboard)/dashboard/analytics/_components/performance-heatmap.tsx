"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DayActivity {
  date: string;
  count: number;
  score?: number;
}

interface PerformanceHeatmapProps {
  data?: DayActivity[];
}

// Generate last 12 weeks of mock data
function generateDefaultData(): DayActivity[] {
  const data: DayActivity[] = [];
  const today = new Date();

  for (let i = 83; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const hasActivity = Math.random() > 0.6;
    data.push({
      date: date.toISOString().split("T")[0],
      count: hasActivity ? Math.floor(Math.random() * 4) + 1 : 0,
      score: hasActivity ? Math.floor(Math.random() * 30) + 70 : undefined,
    });
  }
  return data;
}

const defaultData = generateDefaultData();

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-muted/50";
  if (count === 1) return "bg-primary/25";
  if (count === 2) return "bg-primary/50";
  if (count === 3) return "bg-primary/75";
  return "bg-primary";
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function PerformanceHeatmap({
  data = defaultData,
}: PerformanceHeatmapProps) {
  // Group data by weeks
  const weeks: DayActivity[][] = [];
  let currentWeek: DayActivity[] = [];

  // Pad the beginning to align with day of week
  const firstDate = new Date(data[0]?.date || new Date());
  const startPadding = firstDate.getDay();
  for (let i = 0; i < startPadding; i++) {
    currentWeek.push({ date: "", count: -1 });
  }

  data.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const totalInterviews = data.reduce((acc, d) => acc + d.count, 0);
  const activeDays = data.filter((d) => d.count > 0).length;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Activity Heatmap
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your practice consistency
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="font-semibold">{totalInterviews}</span>
              <span className="text-muted-foreground ml-1">interviews</span>
            </div>
            <div>
              <span className="font-semibold">{activeDays}</span>
              <span className="text-muted-foreground ml-1">active days</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
            {weekDays.map((day, i) => (
              <div
                key={day}
                className="h-4 flex items-center"
                style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            <TooltipProvider>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <Tooltip key={`${weekIndex}-${dayIndex}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-4 w-4 rounded-sm transition-colors ${
                            day.count === -1
                              ? "bg-transparent"
                              : getIntensityClass(day.count)
                          } ${day.count > 0 ? "cursor-pointer hover:ring-2 hover:ring-primary/50" : ""}`}
                        />
                      </TooltipTrigger>
                      {day.count >= 0 && (
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium">{day.date}</p>
                            {day.count > 0 ? (
                              <>
                                <p>
                                  {day.count} interview
                                  {day.count > 1 ? "s" : ""}
                                </p>
                                {day.score && <p>Avg score: {day.score}%</p>}
                              </>
                            ) : (
                              <p className="text-muted-foreground">
                                No activity
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-muted/50" />
            <div className="h-3 w-3 rounded-sm bg-primary/25" />
            <div className="h-3 w-3 rounded-sm bg-primary/50" />
            <div className="h-3 w-3 rounded-sm bg-primary/75" />
            <div className="h-3 w-3 rounded-sm bg-primary" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
