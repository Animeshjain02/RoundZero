import type { InterviewWithReport } from "../schemas";
import { normalizeInsightString } from "../utils";

export function aggregateInsights(interviews: InterviewWithReport[]) {
  const strengthsCount = new Map<string, { count: number; original: string }>();
  const weaknessesCount = new Map<
    string,
    { count: number; original: string }
  >();
  const suggestionsCount = new Map<
    string,
    { count: number; original: string }
  >();

  // Helper to increment count with normalization
  const incrementCount = (
    map: Map<string, { count: number; original: string }>,
    value: string,
  ) => {
    const normalized = normalizeInsightString(value);
    const existing = map.get(normalized);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(normalized, { count: 1, original: value });
    }
  };

  for (const interview of interviews) {
    if (interview.report) {
      for (const s of interview.report.strengths) {
        incrementCount(strengthsCount, s);
      }
      for (const w of interview.report.weaknesses) {
        incrementCount(weaknessesCount, w);
      }
      for (const sg of interview.report.suggestions) {
        incrementCount(suggestionsCount, sg);
      }
    }
  }

  // Sort by frequency and take top 5, return original string for display
  const sortByFrequency = (
    map: Map<string, { count: number; original: string }>,
  ) =>
    Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => item.original);

  return {
    strengths: sortByFrequency(strengthsCount),
    weaknesses: sortByFrequency(weaknessesCount),
    suggestions: sortByFrequency(suggestionsCount),
  };
}
