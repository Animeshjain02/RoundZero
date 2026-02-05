import { getISOWeek } from "date-fns";

import type { InterviewWithReport } from "../schemas";

export function calculateTimeByWeek(interviews: InterviewWithReport[]) {
  // Get unique weeks
  const weekMap = new Map<
    string,
    { technical: number; behavioral: number; systemDesign: number }
  >();

  for (const interview of interviews) {
    // Use date-fns for robust ISO week calculation
    const weekKey = `Week ${getISOWeek(interview.startedAt)}`;

    const existing = weekMap.get(weekKey) || {
      technical: 0,
      behavioral: 0,
      systemDesign: 0,
    };

    const hours = Math.round((interview.durationSec / 3600) * 10) / 10;

    switch (interview.type) {
      case "TECHNICAL":
        existing.technical += hours;
        break;
      case "BEHAVIORAL":
        existing.behavioral += hours;
        break;
      case "SYSTEM_DESIGN":
        existing.systemDesign += hours;
        break;
    }

    weekMap.set(weekKey, existing);
  }

  return Array.from(weekMap.entries())
    .map(([week, data]) => ({
      week,
      technical: Math.round(data.technical * 10) / 10,
      behavioral: Math.round(data.behavioral * 10) / 10,
      systemDesign: Math.round(data.systemDesign * 10) / 10,
    }))
    .slice(-4); // Last 4 weeks
}
