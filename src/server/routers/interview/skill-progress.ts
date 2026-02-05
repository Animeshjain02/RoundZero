import { ORPCError } from "@orpc/client";

import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";
import { type CategoryScores, INTERVIEW_STATUS } from "./schemas";

export async function getSkillProgress({ context }: { context: Context }) {
  const { user } = context;
  if (!user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const completedInterviews = await db.interview.findMany({
    where: { userId: user.id, status: INTERVIEW_STATUS.COMPLETED },
    include: { report: { select: { categoryScores: true } } },
  });

  // Aggregate category scores
  const totals = {
    communication: 0,
    problemSolving: 0,
    technicalKnowledge: 0,
    codeQuality: 0,
    timeManagement: 0,
  };
  let count = 0;

  for (const interview of completedInterviews) {
    if (interview.report?.categoryScores) {
      const scores = interview.report.categoryScores as CategoryScores;
      totals.communication += scores.communication;
      totals.problemSolving += scores.problemSolving;
      totals.technicalKnowledge += scores.technicalKnowledge;
      totals.codeQuality += scores.codeQuality;
      totals.timeManagement += scores.timeManagement;
      count++;
    }
  }

  if (count === 0) {
    return { skills: [] };
  }

  return {
    skills: [
      {
        name: "Communication",
        value: Math.round(totals.communication / count),
      },
      {
        name: "Problem Solving",
        value: Math.round(totals.problemSolving / count),
      },
      {
        name: "Technical Knowledge",
        value: Math.round(totals.technicalKnowledge / count),
      },
      {
        name: "Code Quality",
        value: Math.round(totals.codeQuality / count),
      },
      {
        name: "Time Management",
        value: Math.round(totals.timeManagement / count),
      },
    ],
  };
}
