import { INTERVIEW_STATUS } from "../../interview/schemas";
import type { InterviewWithReport, PreviousPeriodInterview } from "../schemas";

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
