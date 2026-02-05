import { INTERVIEW_STATUS } from "../../interview/schemas";
import type { InterviewWithReport } from "../schemas";
import { formatDateShort, getLocalDateKey } from "../utils";

export function calculateScoreTrend(interviews: InterviewWithReport[]) {
  const completed = interviews.filter(
    (i) => i.status === INTERVIEW_STATUS.COMPLETED && i.report,
  );

  // Group by date - Use local date to avoid timezone shift
  const byDate = new Map<string, { scores: number[]; count: number }>();

  for (const interview of completed) {
    const dateKey = getLocalDateKey(interview.startedAt);
    const existing = byDate.get(dateKey) || { scores: [], count: 0 };
    if (interview.report?.overallScore !== undefined) {
      existing.scores.push(interview.report.overallScore);
    }
    existing.count += 1;
    byDate.set(dateKey, existing);
  }

  // Convert to array and format
  return Array.from(byDate.entries())
    .map(([date, data]) => ({
      date: formatDateShort(date),
      score:
        data.scores.length > 0
          ? Math.round(
              data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
            )
          : 0,
      interviews: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
