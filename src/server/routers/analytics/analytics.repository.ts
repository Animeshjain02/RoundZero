import { getISOWeek } from "date-fns";
import db from "@/lib/prisma";
import {
  type CategoryScores,
  INTERVIEW_STATUS,
} from "../interview/interview.schemas";

// Fetch all data needed for analytics in parallel (per async-parallel best practice)
export async function getAnalyticsData(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  // Calculate previous period dates for comparison
  const periodLength = endDate.getTime() - startDate.getTime();
  const previousStartDate = new Date(startDate.getTime() - periodLength);
  const previousEndDate = new Date(startDate.getTime() - 1);

  // Heatmap needs last 84 days (12 weeks)
  const heatmapStartDate = new Date(Date.now() - 84 * 24 * 60 * 60 * 1000);

  // Execute all queries in parallel for efficiency
  // FIX #1: Use select to only fetch needed fields, avoid pulling large text fields
  const [currentInterviews, previousInterviews, heatmapInterviews] =
    await Promise.all([
      // Current period interviews with only needed report fields
      db.interview.findMany({
        where: {
          userId,
          startedAt: { gte: startDate, lte: endDate },
        },
        select: {
          id: true,
          status: true,
          type: true,
          startedAt: true,
          durationSec: true,
          report: {
            select: {
              overallScore: true,
              categoryScores: true,
              strengths: true,
              weaknesses: true,
              suggestions: true,
            },
          },
        },
        orderBy: { startedAt: "asc" },
      }),

      // Previous period for comparison - only fetch needed fields
      db.interview.findMany({
        where: {
          userId,
          startedAt: { gte: previousStartDate, lte: previousEndDate },
        },
        select: {
          id: true,
          status: true,
          type: true,
          startedAt: true,
          durationSec: true,
          report: {
            select: {
              overallScore: true,
              categoryScores: true,
            },
          },
        },
      }),

      // All interviews for heatmap (last 84 days) - minimal fields
      db.interview.findMany({
        where: {
          userId,
          startedAt: { gte: heatmapStartDate },
        },
        select: {
          id: true,
          startedAt: true,
          report: {
            select: {
              overallScore: true,
            },
          },
        },
        orderBy: { startedAt: "asc" },
      }),
    ]);

  return { currentInterviews, previousInterviews, heatmapInterviews };
}

// Type for interview with report
export type InterviewWithReport = Awaited<
  ReturnType<typeof getAnalyticsData>
>["currentInterviews"][number];

// Type for previous period interviews
export type PreviousPeriodInterview = Awaited<
  ReturnType<typeof getAnalyticsData>
>["previousInterviews"][number];

// Type for heatmap interviews
export type HeatmapInterview = Awaited<
  ReturnType<typeof getAnalyticsData>
>["heatmapInterviews"][number];

// FIX #2: Helper to get date key in local format
// Uses en-CA locale which outputs YYYY-MM-DD format
function getLocalDateKey(date: Date): string {
  return date.toLocaleDateString("en-CA");
}

// Calculate overview stats
export function calculateOverview(
  currentInterviews: InterviewWithReport[],
  previousInterviews: PreviousPeriodInterview[],
) {
  const completed = currentInterviews.filter(
    (i) => i.status === INTERVIEW_STATUS.COMPLETED,
  );
  const prevCompleted = previousInterviews.filter(
    (i) => i.status === INTERVIEW_STATUS.COMPLETED,
  );

  // Current period stats
  const totalInterviews = currentInterviews.length;
  const completedCount = completed.length;
  const completionRate =
    totalInterviews > 0
      ? Math.round((completedCount / totalInterviews) * 100)
      : 0;

  const scores = completed
    .map((i) => i.report?.overallScore)
    .filter((s): s is number => s !== null && s !== undefined);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;

  const totalPracticeTime =
    Math.round(
      (currentInterviews.reduce((acc, i) => acc + i.durationSec, 0) / 3600) *
        10,
    ) / 10; // hours

  // Previous period stats for comparison
  const prevTotal = previousInterviews.length;
  const prevCompletedCount = prevCompleted.length;
  const prevCompletionRate =
    prevTotal > 0 ? Math.round((prevCompletedCount / prevTotal) * 100) : 0;

  const prevScores = prevCompleted
    .map((i) => i.report?.overallScore)
    .filter((s): s is number => s !== null && s !== undefined);
  const prevAvgScore =
    prevScores.length > 0
      ? Math.round(prevScores.reduce((a, b) => a + b, 0) / prevScores.length)
      : null;

  const prevPracticeTime =
    Math.round(
      (previousInterviews.reduce((acc, i) => acc + i.durationSec, 0) / 3600) *
        10,
    ) / 10;

  // Calculate changes
  const interviewsChange =
    prevTotal > 0
      ? Math.round(((totalInterviews - prevTotal) / prevTotal) * 100)
      : totalInterviews > 0
        ? 100
        : 0;

  const scoreChange =
    prevAvgScore !== null && avgScore !== null
      ? Math.round(avgScore - prevAvgScore)
      : 0;

  const timeChange =
    prevPracticeTime > 0
      ? Math.round(
          ((totalPracticeTime - prevPracticeTime) / prevPracticeTime) * 100,
        )
      : totalPracticeTime > 0
        ? 100
        : 0;

  const completionChange = completionRate - prevCompletionRate;

  return {
    totalInterviews,
    avgScore,
    totalPracticeTime,
    completionRate,
    interviewsChange,
    scoreChange,
    timeChange,
    completionChange,
  };
}

// Calculate score trend for area chart
export function calculateScoreTrend(interviews: InterviewWithReport[]) {
  const completed = interviews.filter(
    (i) => i.status === INTERVIEW_STATUS.COMPLETED && i.report,
  );

  // Group by date - FIX #2: Use local date to avoid timezone shift
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

// Calculate interview type breakdown for pie chart
export function calculateTypeBreakdown(interviews: InterviewWithReport[]) {
  const counts = {
    TECHNICAL: 0,
    BEHAVIORAL: 0,
    SYSTEM_DESIGN: 0,
  };

  for (const interview of interviews) {
    if (interview.type in counts) {
      counts[interview.type as keyof typeof counts]++;
    }
  }

  return [
    {
      name: "Technical",
      value: counts.TECHNICAL,
      color: "var(--color-primary)",
    },
    { name: "Behavioral", value: counts.BEHAVIORAL, color: "#22c55e" },
    { name: "System Design", value: counts.SYSTEM_DESIGN, color: "#f97316" },
  ].filter((item) => item.value > 0);
}

// FIX #3: Safe score extraction with runtime type checking
function safeGetScore(scores: unknown, key: string): number | null {
  if (
    scores &&
    typeof scores === "object" &&
    key in scores &&
    typeof (scores as Record<string, unknown>)[key] === "number"
  ) {
    return (scores as Record<string, number>)[key];
  }
  return null;
}

// Calculate skill radar data (current vs previous period)
export function calculateSkillRadar(
  currentInterviews: InterviewWithReport[],
  previousInterviews: PreviousPeriodInterview[],
) {
  const skillNames = [
    "Communication",
    "Problem Solving",
    "Technical Knowledge",
    "Code Quality",
    "Time Management",
  ] as const;

  const skillKeys = [
    "communication",
    "problemSolving",
    "technicalKnowledge",
    "codeQuality",
    "timeManagement",
  ] as const;

  // Generic helper that works with both full and partial interview types
  const calculateAvgScores = (
    interviews: Array<{ report?: { categoryScores: unknown } | null }>,
  ) => {
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    for (const interview of interviews) {
      if (interview.report?.categoryScores) {
        const scores = interview.report.categoryScores;
        // FIX #3: Use safe extraction with runtime type checking
        for (const key of skillKeys) {
          const score = safeGetScore(scores, key);
          if (score !== null) {
            totals[key] = (totals[key] || 0) + score;
            counts[key] = (counts[key] || 0) + 1;
          }
        }
      }
    }

    return skillKeys.map((key) =>
      counts[key] ? Math.round(totals[key] / counts[key]) : 0,
    );
  };

  const currentScores = calculateAvgScores(currentInterviews);
  const previousScores = calculateAvgScores(previousInterviews);

  return skillNames.map((name, i) => ({
    skill: name,
    current: currentScores[i],
    previous: previousScores[i],
  }));
}

// Calculate time spent by week for bar chart
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

// FIX #5: Pre-aggregate heatmap data in a single pass (O(N) instead of O(N*84))
interface HeatmapDayData {
  count: number;
  totalScore: number;
  scoreCount: number;
}

// Calculate activity heatmap data
export function calculateHeatmap(interviews: HeatmapInterview[]) {
  const today = new Date();
  const result: Array<{ date: string; count: number; score: number | null }> =
    [];

  // FIX #5: Pre-aggregate data in a single pass using a Map
  // This avoids O(N^2) complexity from filtering arrays inside the loop
  const aggregatedData = new Map<string, HeatmapDayData>();

  for (const interview of interviews) {
    const dateKey = getLocalDateKey(interview.startedAt); // FIX #2: Use local date
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
    const dateKey = getLocalDateKey(date); // FIX #2: Use local date

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

// FIX #4: Normalize strings for better aggregation
function normalizeInsightString(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

// Aggregate insights from reports
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

  // FIX #4: Helper to increment count with normalization
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

// Helper functions
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Get date range based on period
export function getDateRange(period: "7d" | "30d" | "90d" | "all"): {
  startDate: Date;
  endDate: Date;
} {
  const now = new Date();
  const endDate = new Date(now);

  let startDate: Date;

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "all":
      startDate = new Date(0); // Beginning of time
      break;
  }

  return { startDate, endDate };
}
