import type { Prisma } from "@prisma/client";
import { Prisma as PrismaNamespace } from "@prisma/client";
import { textToSpeech } from "@/lib/deepgram";
import {
  type Report as GeneratedInterviewReport,
  generateInterviewResponse,
  generateReport,
} from "@/lib/gemini";
import db from "@/lib/prisma";
import {
  buildReportPrompt,
  buildSystemPrompt,
  type ExperienceLevel,
  type InterviewType,
} from "@/lib/prompts/interview-prompts";
import { storageService } from "@/lib/storage";
import {
  type CategoryScores,
  type Report as InterviewReport,
  MESSAGE_ROLES,
} from "./schemas";
import {
  cleanTextForTTS,
  DEFAULT_GREETING,
  INITIAL_USER_PROMPT,
  toAIMessages,
} from "./utils";

export const interviewMessageSelect = {
  id: true,
  role: true,
  content: true,
  audioUrl: true,
  codeSnippet: true,
  language: true,
  createdAt: true,
} satisfies Prisma.MessageSelect;

export const interviewReportSelect = {
  overallScore: true,
  summary: true,
  categoryScores: true,
  strengths: true,
  weaknesses: true,
  suggestions: true,
} satisfies Prisma.ReportSelect;

export type InterviewMessageRecord = Prisma.MessageGetPayload<{
  select: typeof interviewMessageSelect;
}>;

export type InterviewReportRecord = Prisma.ReportGetPayload<{
  select: typeof interviewReportSelect;
}>;

type InterviewPromptContext = {
  id: string;
  jobTitle: string;
  resumeText: string | null;
  experienceLevel: string;
  type: string;
  techStack: string | null;
  includeDSA: boolean;
  companyName?: string | null;
  jobDescription?: string | null;
};

const SHORT_INTERVIEW_REPORT: InterviewReport = {
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

const FALLBACK_GENERATED_REPORT: InterviewReport = {
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

export const buildPromptForInterview = (
  interview: InterviewPromptContext,
): string =>
  buildSystemPrompt({
    jobTitle: interview.jobTitle,
    resumeText: interview.resumeText ?? "",
    experienceLevel: interview.experienceLevel as ExperienceLevel,
    type: interview.type as InterviewType,
    techStack: interview.techStack ?? undefined,
    includeDSA: interview.includeDSA,
    companyName: interview.companyName ?? undefined,
    jobDescription: interview.jobDescription ?? undefined,
  });

export const serializeInterviewMessage = (message: InterviewMessageRecord) => ({
  id: message.id,
  role: message.role as "system" | "user" | "assistant",
  content: message.content,
  audioUrl: message.audioUrl,
  codeSnippet: message.codeSnippet,
  language: message.language,
  createdAt: message.createdAt,
});

export function serializeInterviewReport(
  report: InterviewReportRecord,
): InterviewReport;
export function serializeInterviewReport(
  report: InterviewReportRecord | null,
): InterviewReport | null;
export function serializeInterviewReport(report: InterviewReportRecord | null) {
  if (!report) {
    return null;
  }

  return {
    overallScore: report.overallScore,
    categoryScores: report.categoryScores as CategoryScores,
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    suggestions: report.suggestions,
    summary: report.summary,
  };
}

export const getLatestAssistantMessage = (
  messages: InterviewMessageRecord[],
): InterviewMessageRecord | null => {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === MESSAGE_ROLES.ASSISTANT) {
      return messages[index];
    }
  }

  return null;
};

export const listInterviewMessages = async (
  interviewId: string,
): Promise<InterviewMessageRecord[]> =>
  db.message.findMany({
    where: { interviewId },
    orderBy: { createdAt: "asc" },
    select: interviewMessageSelect,
  });

export const createUserInterviewMessage = async (input: {
  interviewId: string;
  content: string;
  codeSnippet?: string;
  language?: string;
}): Promise<InterviewMessageRecord> =>
  db.message.create({
    data: {
      interviewId: input.interviewId,
      role: MESSAGE_ROLES.USER,
      content: input.content,
      codeSnippet: input.codeSnippet,
      language: input.language,
    },
    select: interviewMessageSelect,
  });

export const createAssistantInterviewMessage = async (input: {
  interviewId: string;
  content: string;
  audioUrl?: string;
}): Promise<InterviewMessageRecord> =>
  db.message.create({
    data: {
      interviewId: input.interviewId,
      role: MESSAGE_ROLES.ASSISTANT,
      content: input.content,
      audioUrl: input.audioUrl,
    },
    select: interviewMessageSelect,
  });

export const generateAndUploadInterviewAudio = async (
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

export const generateOpeningInterviewMessage = async (
  interview: InterviewPromptContext,
): Promise<string> => {
  try {
    return await generateInterviewResponse(buildPromptForInterview(interview), [
      { role: "user", content: INITIAL_USER_PROMPT },
    ]);
  } catch (error) {
    console.error("[AI Generation Error]", error);
    return DEFAULT_GREETING;
  }
};

export const generateInterviewReply = async (
  interview: InterviewPromptContext,
  messages: InterviewMessageRecord[],
): Promise<string> =>
  generateInterviewResponse(
    buildPromptForInterview(interview),
    toAIMessages(messages),
  );

export const generateInterviewReportData = async (
  messages: InterviewMessageRecord[],
): Promise<InterviewReport> => {
  if (messages.length < 2) {
    return SHORT_INTERVIEW_REPORT;
  }

  try {
    return await generateReport(buildReportPrompt(), toAIMessages(messages));
  } catch (error) {
    console.error("[Report Generation Error]", error);
    return FALLBACK_GENERATED_REPORT;
  }
};

export const isUniqueConstraintError = (error: unknown): boolean =>
  error instanceof PrismaNamespace.PrismaClientKnownRequestError &&
  error.code === "P2002";

export const toPersistableReportData = (
  report: GeneratedInterviewReport | InterviewReport,
) => ({
  overallScore: report.overallScore,
  summary: report.summary,
  categoryScores: report.categoryScores as CategoryScores,
  strengths: report.strengths,
  weaknesses: report.weaknesses,
  suggestions: report.suggestions,
});
