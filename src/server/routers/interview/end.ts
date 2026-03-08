import { ORPCError } from "@orpc/client";
import { z } from "zod";
import db from "@/lib/prisma";

import type { Context } from "@/server/orpc";
import { durationSecSchema, INTERVIEW_STATUS } from "./schemas";
import {
  generateInterviewReportData,
  interviewReportSelect,
  isUniqueConstraintError,
  listInterviewMessages,
  serializeInterviewReport,
  toPersistableReportData,
} from "./service";

export const endSessionInput = z.object({
  interviewId: z.string().min(1, "Interview ID is required"),
  durationSec: durationSecSchema,
});

export async function endSession({
  input,
  context,
}: {
  input: z.infer<typeof endSessionInput>;
  context: Context;
}) {
  const { user } = context;
  if (!user) throw new ORPCError("UNAUTHORIZED");

  const interview = await db.interview.findFirst({
    where: { id: input.interviewId, userId: user.id },
    select: {
      id: true,
      durationSec: true,
      endedAt: true,
      report: {
        select: interviewReportSelect,
      },
    },
  });

  if (!interview) {
    throw new ORPCError("NOT_FOUND", { message: "Interview not found" });
  }

  if (interview.report) {
    return {
      report: serializeInterviewReport(interview.report),
    };
  }

  const history = await listInterviewMessages(interview.id);
  const reportData = await generateInterviewReportData(history);
  const reportPayload = toPersistableReportData(reportData);

  const persistedReport = await db.$transaction(async (tx) => {
    await tx.interview.update({
      where: { id: interview.id, userId: user.id },
      data: {
        durationSec: Math.max(interview.durationSec, input.durationSec),
        endedAt: interview.endedAt ?? new Date(),
        status: INTERVIEW_STATUS.COMPLETED,
      },
    });

    const existingReport = await tx.report.findUnique({
      where: { interviewId: interview.id },
      select: interviewReportSelect,
    });

    if (existingReport) {
      return existingReport;
    }

    try {
      return await tx.report.create({
        data: {
          interviewId: interview.id,
          ...reportPayload,
        },
        select: interviewReportSelect,
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        const concurrentReport = await tx.report.findUnique({
          where: { interviewId: interview.id },
          select: interviewReportSelect,
        });

        if (concurrentReport) {
          return concurrentReport;
        }
      }

      throw error;
    }
  });

  return { report: serializeInterviewReport(persistedReport) };
}
