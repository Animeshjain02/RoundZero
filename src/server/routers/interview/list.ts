import { ORPCError } from "@orpc/client";
import { z } from "zod";

import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";
import { type InterviewStatus, interviewStatusSchema } from "./schemas";

// Pagination defaults
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const listInterviewsInput = z.object({
  limit: z.number().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
  offset: z.number().min(0).default(0),
  status: interviewStatusSchema.optional(),
});

export async function listInterviews({
  input,
  context,
}: {
  input: z.infer<typeof listInterviewsInput>;
  context: Context;
}) {
  const { user } = context;
  if (!user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const { limit, offset, status } = input;

  const where = {
    userId: user.id,
    ...(status && { status: status as InterviewStatus }),
  };

  const [interviews, total] = await Promise.all([
    db.interview.findMany({
      where,
      orderBy: { startedAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        jobTitle: true,
        type: true,
        status: true,
        startedAt: true,
        endedAt: true,
        durationSec: true,
        report: {
          select: {
            overallScore: true,
          },
        },
      },
    }),
    db.interview.count({
      where,
    }),
  ]);

  return {
    interviews: interviews.map((interview) => ({
      id: interview.id,
      jobTitle: interview.jobTitle,
      type: interview.type,
      status: interview.status,
      startedAt: interview.startedAt,
      endedAt: interview.endedAt,
      durationSec: interview.durationSec,
      score: interview.report?.overallScore ?? null,
    })),
    total,
  };
}
