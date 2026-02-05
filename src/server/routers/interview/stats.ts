import { ORPCError } from "@orpc/client";

import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";
import { INTERVIEW_STATUS } from "./schemas";

export async function getStats({ context }: { context: Context }) {
  const { user } = context;
  if (!user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const userId = user.id;

  const [totalSessions, completedInterviews, totalDuration] = await Promise.all(
    [
      db.interview.count({ where: { userId } }),
      db.interview.findMany({
        where: { userId, status: INTERVIEW_STATUS.COMPLETED },
        include: { report: { select: { overallScore: true } } },
      }),
      db.interview.aggregate({
        where: { userId },
        _sum: { durationSec: true },
      }),
    ],
  );

  const scores = completedInterviews
    .map((i) => i.report?.overallScore)
    .filter((s): s is number => s !== null && s !== undefined);

  const averageScore =
    scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
        10
      : null;

  return {
    totalSessions,
    completedCount: completedInterviews.length,
    averageScore,
    totalDurationSec: totalDuration._sum.durationSec ?? 0,
  };
}
