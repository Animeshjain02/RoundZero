import { ORPCError } from "@orpc/client";
import { z } from "zod";
import { type AIMessage, generateReport } from "@/lib/gemini";
import db from "@/lib/prisma";
import { buildReportPrompt } from "@/lib/prompts/interview-prompts";

import type { Context } from "@/server/orpc";
import {
  type CategoryScores,
  durationSecSchema,
  INTERVIEW_STATUS,
} from "./schemas";

// Helper duplicated from chat.ts to keep files independent/clean or could be shared
import { toAIMessages } from "./utils";

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
  });

  if (!interview) {
    throw new ORPCError("NOT_FOUND", { message: "Interview not found" });
  }

  await db.interview.update({
    where: { id: interview.id, userId: user.id },
    data: {
      durationSec: input.durationSec,
      endedAt: new Date(),
      status: INTERVIEW_STATUS.COMPLETED,
    },
  });

  const history = await db.message.findMany({
    where: { interviewId: interview.id },
    orderBy: { createdAt: "asc" },
  });
  const messages = toAIMessages(history);

  if (messages.length < 2) {
    const defaultReport = {
      overallScore: 0,
      categoryScores: {
        communication: 0,
        problemSolving: 0,
        technicalKnowledge: 0,
        codeQuality: 0,
        timeManagement: 0,
      },
      strengths: ["Interview was too short to evaluate"],
      weaknesses: ["Not enough conversation to assess"],
      suggestions: ["Complete a full interview session for detailed feedback"],
      summary:
        "The interview session was too brief to generate a comprehensive evaluation. Please complete a full interview with multiple questions and answers for detailed feedback.",
    };

    await db.report.create({
      data: {
        interviewId: interview.id,
        overallScore: defaultReport.overallScore,
        summary: defaultReport.summary,
        categoryScores: defaultReport.categoryScores as CategoryScores,
        strengths: defaultReport.strengths,
        weaknesses: defaultReport.weaknesses,
        suggestions: defaultReport.suggestions,
      },
    });

    return { report: defaultReport };
  }

  const reportPrompt = buildReportPrompt();

  let reportData;
  try {
    reportData = await generateReport(reportPrompt, messages);
  } catch (error) {
    console.error("[Report Generation Error]", error);

    const fallbackReport = {
      overallScore: 50,
      categoryScores: {
        communication: 50,
        problemSolving: 50,
        technicalKnowledge: 50,
        codeQuality: 50,
        timeManagement: 50,
      },
      strengths: ["Participated in the interview"],
      weaknesses: ["Unable to fully analyze performance"],
      suggestions: ["Try another interview session for better feedback"],
      summary:
        "We encountered an issue generating your detailed report. Based on your participation, we've provided a baseline score. Please try another interview for more accurate feedback.",
    };

    await db.report.create({
      data: {
        interviewId: interview.id,
        overallScore: fallbackReport.overallScore,
        summary: fallbackReport.summary,
        categoryScores: fallbackReport.categoryScores as CategoryScores,
        strengths: fallbackReport.strengths,
        weaknesses: fallbackReport.weaknesses,
        suggestions: fallbackReport.suggestions,
      },
    });

    return { report: fallbackReport };
  }

  await db.report.create({
    data: {
      interviewId: interview.id,
      overallScore: reportData.overallScore,
      summary: reportData.summary,
      categoryScores: reportData.categoryScores as CategoryScores,
      strengths: reportData.strengths,
      weaknesses: reportData.weaknesses,
      suggestions: reportData.suggestions,
    },
  });

  return { report: reportData };
}
