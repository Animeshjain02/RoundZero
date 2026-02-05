import type { HeatmapDayData, HeatmapInterview } from "../schemas";
import { getLocalDateKey } from "../utils";

export function calculateHeatmap(interviews: HeatmapInterview[]) {
  const today = new Date();
  const result: Array<{ date: string; count: number; score: number | null }> =
    [];

  // Pre-aggregate data in a single pass using a Map
  const aggregatedData = new Map<string, HeatmapDayData>();

  for (const interview of interviews) {
    const dateKey = getLocalDateKey(interview.startedAt); // Use local date
    const existing = aggregatedData.get(dateKey) || {
      count: 0,
      totalScore: 0,
      scoreCount: 0,
    };

    existing.count += 1;
    if (interview.report?.overallScore !== undefined) {
      existing.totalScore += interview.report.overallScore;
      existing.scoreCount += 1;
    }

    aggregatedData.set(dateKey, existing);
  }

  // Generate last 84 days - now O(1) lookup per day
  for (let i = 83; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = getLocalDateKey(date); // Use local date

    const dayData = aggregatedData.get(dateKey);
    const count = dayData?.count || 0;
    const avgScore =
      dayData && dayData.scoreCount > 0
        ? Math.round(dayData.totalScore / dayData.scoreCount)
        : null;

    result.push({ date: dateKey, count, score: avgScore });
  }

  return result;
}
