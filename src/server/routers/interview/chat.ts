import { ORPCError } from "@orpc/client";
import { z } from "zod";
import { type AIMessage, generateInterviewResponse } from "@/lib/gemini";
import db from "@/lib/prisma";
import {
  buildSystemPrompt,
  type ExperienceLevel,
  type InterviewType,
} from "@/lib/prompts/interview-prompts";

import type { Context } from "@/server/orpc";
import { MESSAGE_ROLES } from "./schemas";
import { generateAndUploadAudio } from "./start";

// Convert database messages to AI message format
import { toAIMessages } from "./utils";

export const chatInput = z.object({
  interviewId: z.string().min(1, "Interview ID is required"),
  message: z.string().min(1, "Message is required"),
  codeSnippet: z.string().optional(),
  language: z.string().optional(),
});

export async function chat({
  input,
  context,
}: {
  input: z.infer<typeof chatInput>;
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

  await db.message.create({
    data: {
      interviewId: interview.id,
      role: MESSAGE_ROLES.USER,
      content: input.message,
      codeSnippet: input.codeSnippet,
      language: input.language,
    },
  });

  const history = await db.message.findMany({
    where: { interviewId: interview.id },
    orderBy: { createdAt: "asc" },
  });
  const messages = toAIMessages(history);

  const systemPrompt = buildSystemPrompt({
    jobTitle: interview.jobTitle,
    resumeText: interview.resumeText ?? "",
    experienceLevel: interview.experienceLevel as ExperienceLevel,
    type: interview.type as InterviewType,
    techStack: interview.techStack ?? undefined,
    includeDSA: interview.includeDSA,
  });

  let aiResponseText: string;
  try {
    aiResponseText = await generateInterviewResponse(systemPrompt, messages);
  } catch (error) {
    console.error("[AI Generation Error]", error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to generate AI response",
    });
  }

  const audioUrl = await generateAndUploadAudio(aiResponseText, interview.id);

  const savedMessage = await db.message.create({
    data: {
      interviewId: interview.id,
      role: MESSAGE_ROLES.ASSISTANT,
      content: aiResponseText,
      audioUrl,
    },
  });

  return {
    message: aiResponseText,
    audioUrl,
    savedMessageId: savedMessage.id,
  };
}
