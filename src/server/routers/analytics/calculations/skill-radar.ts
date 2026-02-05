import type { InterviewWithReport, PreviousPeriodInterview } from "../schemas";
import { safeGetScore } from "../utils";

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
        // Use safe extraction with runtime type checking
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
