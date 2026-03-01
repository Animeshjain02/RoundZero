import { ORPCError } from "@orpc/client";
import { z } from "zod";
import { textToSpeech } from "@/lib/deepgram";
import { generateInterviewResponse } from "@/lib/gemini";
import db from "@/lib/prisma";
import {
  buildSystemPrompt,
  type ExperienceLevel,
  type InterviewType,
} from "@/lib/prompts/interview-prompts";
import { storageService } from "@/lib/storage";

import type { Context } from "@/server/orpc";
import { INTERVIEW_STATUS, MESSAGE_ROLES } from "./schemas";

// Service / Helper Logic (kept inline or could be moved to utils)
import {
  cleanTextForTTS,
  DEFAULT_GREETING,
  INITIAL_USER_PROMPT,
} from "./utils";

export const generateAndUploadAudio = async (
  text: string,
  interviewId: string,
): Promise<string | undefined> => {
  try {
    const cleanedText = cleanTextForTTS(text);
    const audioBuffer = await textToSpeech(` ${cleanedText}`);
    return await storageService.uploadAudio(audioBuffer, interviewId);
  } catch (error) {
    console.error("[TTS Error]", error);
    return undefined;
  }
};

export const startSessionInput = z.object({
  interviewId: z.string().min(1, "Interview ID is required"),
});

export async function startSession({
  input,
  context,
}: {
  input: z.infer<typeof startSessionInput>;
  context: Context;
}) {
  const { user } = context;
  if (!user) throw new ORPCError("UNAUTHORIZED");

  const interview = await db.interview.findFirst({
    where: { id: input.interviewId, userId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
      report: true,
      resume: true,
    },
  });

  if (!interview) {
    throw new ORPCError("NOT_FOUND", { message: "Interview not found" });
  }

  // If already started and has messages, return the last assistant message
  if (interview.messages.length > 0) {
    const lastAssistantMessage = interview.messages
      .filter((m) => m.role === MESSAGE_ROLES.ASSISTANT)
      .pop();

    if (lastAssistantMessage) {
      return {
        message: lastAssistantMessage.content,
        audioUrl: lastAssistantMessage.audioUrl ?? undefined,
        status:
          interview.status as (typeof INTERVIEW_STATUS)[keyof typeof INTERVIEW_STATUS],
      };
    }
  }

  const systemPrompt = buildSystemPrompt({
    jobTitle: interview.jobTitle,
    resumeText: interview.resumeText ?? "",
    experienceLevel: interview.experienceLevel as ExperienceLevel,
    type: interview.type as InterviewType,
    techStack: interview.techStack ?? undefined,
    includeDSA: interview.includeDSA,
    companyName: interview.companyName ?? undefined,
    jobDescription: interview.jobDescription ?? undefined,
  });

  let openingMessage: string;
  try {
    openingMessage = await generateInterviewResponse(systemPrompt, [
      { role: "user", content: INITIAL_USER_PROMPT },
    ]);
  } catch (error) {
    console.error("[AI Generation Error]", error);
    openingMessage = DEFAULT_GREETING;
  }

  const audioUrl = await generateAndUploadAudio(openingMessage, interview.id);

  if (interview.status === INTERVIEW_STATUS.SETUP) {
    await db.interview.update({
      where: { id: interview.id, userId: user.id },
      data: { status: INTERVIEW_STATUS.IN_PROGRESS },
    });
  }

  await db.message.create({
    data: {
      interviewId: interview.id,
      role: MESSAGE_ROLES.ASSISTANT,
      content: openingMessage,
      audioUrl,
    },
  });

  return {
    message: openingMessage,
    audioUrl,
    status: INTERVIEW_STATUS.IN_PROGRESS,
  };
}
