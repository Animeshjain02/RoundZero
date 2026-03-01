import { ORPCError } from "@orpc/client";
import { z } from "zod";

import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";
import type { CategoryScores, MESSAGE_ROLES } from "./schemas";

export const getInterviewByIdInput = z.object({
  id: z.string().min(1, "Interview ID is required"),
});

export async function getInterviewById({
  input,
  context,
}: {
  input: z.infer<typeof getInterviewByIdInput>;
  context: Context;
}) {
  const { user } = context;
  if (!user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const interview = await db.interview.findFirst({
    where: { id: input.id, userId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
      report: true,
      resume: true,
    },
  });

  if (!interview) {
    return { interview: null };
  }

  return {
    interview: {
      id: interview.id,
      jobTitle: interview.jobTitle,
      type: interview.type,
      status: interview.status,
      startedAt: interview.startedAt,
      endedAt: interview.endedAt,
      durationSec: interview.durationSec,
      resumeText: interview.resumeText,
      techStack: interview.techStack,
      experienceLevel: interview.experienceLevel,
      includeDSA: interview.includeDSA,
      companyName: interview.companyName,
      jobDescription: interview.jobDescription,
      messages: interview.messages.map((message) => ({
        id: message.id,
        role: message.role as (typeof MESSAGE_ROLES)[keyof typeof MESSAGE_ROLES],
        content: message.content,
        audioUrl: message.audioUrl,
        createdAt: message.createdAt,
      })),
      report: interview.report
        ? {
            overallScore: interview.report.overallScore,
            categoryScores: interview.report.categoryScores as CategoryScores,
            strengths: interview.report.strengths,
            weaknesses: interview.report.weaknesses,
            suggestions: interview.report.suggestions,
            summary: interview.report.summary,
          }
        : null,
    },
  };
}
