import { ORPCError } from "@orpc/client";
import { z } from "zod";

import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";
import {
  interviewMessageSelect,
  interviewReportSelect,
  serializeInterviewMessage,
  serializeInterviewReport,
} from "./service";

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
    select: {
      id: true,
      jobTitle: true,
      type: true,
      status: true,
      startedAt: true,
      endedAt: true,
      durationSec: true,
      resumeText: true,
      techStack: true,
      experienceLevel: true,
      includeDSA: true,
      companyName: true,
      jobDescription: true,
      messages: {
        orderBy: { createdAt: "asc" },
        select: interviewMessageSelect,
      },
      report: {
        select: interviewReportSelect,
      },
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
      messages: interview.messages.map(serializeInterviewMessage),
      report: serializeInterviewReport(interview.report),
    },
  };
}
