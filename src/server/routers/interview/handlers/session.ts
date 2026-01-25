import { ORPCError } from "@orpc/client";
import { textToSpeech } from "@/lib/deepgram";
import {
  type AIMessage,
  generateInterviewResponse,
  generateReport,
} from "@/lib/gemini";
import {
  buildReportPrompt,
  buildSystemPrompt,
  type ExperienceLevel,
  type InterviewType,
} from "@/lib/prompts/interview-prompts";
import { storageService } from "@/lib/storage";
import { sessionContract } from "../contracts/session";
import { interviewRepository } from "../interview.repository";
import {
  type CategoryScores,
  INTERVIEW_STATUS,
  MESSAGE_ROLES,
} from "../interview.schemas";

// Default greeting message if AI generation fails
const DEFAULT_GREETING =
  "Hello! I'm Alex. Let's start the interview. Can you please introduce yourself?";

// Initial prompt to seed the AI conversation
const INITIAL_USER_PROMPT =
  "I am ready to start the interview. Please introduce yourself and ask the first question.";

// Generate TTS audio and upload to storage
// Returns undefined if TTS fails (graceful degradation)
const generateAndUploadAudio = async (
  text: string,
  interviewId: string,
): Promise<string | undefined> => {
  try {
    const audioBuffer = await textToSpeech(text);
    return await storageService.uploadAudio(audioBuffer, interviewId);
  } catch (error) {
    console.error("[TTS Error]", error);
    return undefined;
  }
};

// Convert database messages to AI message format
const toAIMessages = (
  messages: Array<{
    role: string;
    content: string;
    codeSnippet?: string | null;
    language?: string | null;
  }>,
): AIMessage[] => {
  return messages.map((m) => {
    let content = m.content;
    if (m.codeSnippet) {
      content += `\n\nCode Snippet:\n\`\`\`${m.language || ""}\n${
        m.codeSnippet
      }\n\`\`\``;
    }
    return {
      role: m.role as "user" | "assistant" | "system",
      content,
    };
  });
};

export const sessionHandlers = {
  // Start an interview session
  start: sessionContract.start.handler(async ({ input, context }) => {
    const { user } = context;
    if (!user) throw new ORPCError("UNAUTHORIZED");

    const interview = await interviewRepository.getById(
      input.interviewId,
      user.id,
    );
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

    // Build system prompt for the interview
    const systemPrompt = buildSystemPrompt({
      jobTitle: interview.jobTitle,
      resumeText: interview.resumeText ?? "",
      experienceLevel: interview.experienceLevel as ExperienceLevel,
      type: interview.type as InterviewType,
      techStack: interview.techStack ?? undefined,
      includeDSA: interview.includeDSA,
    });

    // Generate opening message
    let openingMessage: string;
    try {
      openingMessage = await generateInterviewResponse(systemPrompt, [
        { role: "user", content: INITIAL_USER_PROMPT },
      ]);
    } catch (error) {
      console.error("[AI Generation Error]", error);
      openingMessage = DEFAULT_GREETING;
    }

    // Generate audio for the opening message
    const audioUrl = await generateAndUploadAudio(openingMessage, interview.id);

    // Update interview status to IN_PROGRESS
    if (interview.status === INTERVIEW_STATUS.SETUP) {
      await interviewRepository.updateStatus(
        interview.id,
        user.id,
        INTERVIEW_STATUS.IN_PROGRESS,
      );
    }

    // Save the assistant message
    await interviewRepository.addMessage({
      interviewId: interview.id,
      role: MESSAGE_ROLES.ASSISTANT,
      content: openingMessage,
      audioUrl,
    });

    return {
      message: openingMessage,
      audioUrl,
      status: INTERVIEW_STATUS.IN_PROGRESS,
    };
  }),

  // Process a chat message and get AI response
  chat: sessionContract.chat.handler(async ({ input, context }) => {
    const { user } = context;
    if (!user) throw new ORPCError("UNAUTHORIZED");

    const interview = await interviewRepository.getById(
      input.interviewId,
      user.id,
    );
    if (!interview) {
      throw new ORPCError("NOT_FOUND", { message: "Interview not found" });
    }

    // Save user message
    await interviewRepository.addMessage({
      interviewId: interview.id,
      role: MESSAGE_ROLES.USER,
      content: input.message,
      codeSnippet: input.codeSnippet,
      language: input.language,
    });

    // Get conversation history
    const history = await interviewRepository.getMessages(interview.id);
    const messages = toAIMessages(history);

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      jobTitle: interview.jobTitle,
      resumeText: interview.resumeText ?? "",
      experienceLevel: interview.experienceLevel as ExperienceLevel,
      type: interview.type as InterviewType,
      techStack: interview.techStack ?? undefined,
      includeDSA: interview.includeDSA,
    });

    // Generate AI response
    let aiResponseText: string;
    try {
      aiResponseText = await generateInterviewResponse(systemPrompt, messages);
    } catch (error) {
      console.error("[AI Generation Error]", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to generate AI response",
      });
    }

    // Generate audio for the response
    const audioUrl = await generateAndUploadAudio(aiResponseText, interview.id);

    // Save AI message
    const savedMessage = await interviewRepository.addMessage({
      interviewId: interview.id,
      role: MESSAGE_ROLES.ASSISTANT,
      content: aiResponseText,
      audioUrl,
    });

    return {
      message: aiResponseText,
      audioUrl,
      savedMessageId: savedMessage.id,
    };
  }),

  // End an interview and generate report
  end: sessionContract.end.handler(async ({ input, context }) => {
    const { user } = context;
    if (!user) throw new ORPCError("UNAUTHORIZED");

    const interview = await interviewRepository.getById(
      input.interviewId,
      user.id,
    );
    if (!interview) {
      throw new ORPCError("NOT_FOUND", { message: "Interview not found" });
    }

    // Update duration and status
    await interviewRepository.updateDuration(
      interview.id,
      user.id,
      input.durationSec,
    );
    await interviewRepository.updateStatus(
      interview.id,
      user.id,
      INTERVIEW_STATUS.COMPLETED,
    );

    // Get conversation history for report generation
    const history = await interviewRepository.getMessages(interview.id);
    const messages = toAIMessages(history);

    // Check if there's enough conversation to generate a meaningful report
    if (messages.length < 2) {
      // Return a default report if not enough conversation
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
        suggestions: [
          "Complete a full interview session for detailed feedback",
        ],
        summary:
          "The interview session was too brief to generate a comprehensive evaluation. Please complete a full interview with multiple questions and answers for detailed feedback.",
      };

      await interviewRepository.createReport({
        interviewId: interview.id,
        overallScore: defaultReport.overallScore,
        summary: defaultReport.summary,
        categoryScores: defaultReport.categoryScores as CategoryScores,
        strengths: defaultReport.strengths,
        weaknesses: defaultReport.weaknesses,
        suggestions: defaultReport.suggestions,
      });

      return { report: defaultReport };
    }

    // Generate report
    const reportPrompt = buildReportPrompt();

    let reportData;
    try {
      reportData = await generateReport(reportPrompt, messages);
    } catch (error) {
      console.error("[Report Generation Error]", error);

      // Fallback report on generation failure
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

      await interviewRepository.createReport({
        interviewId: interview.id,
        overallScore: fallbackReport.overallScore,
        summary: fallbackReport.summary,
        categoryScores: fallbackReport.categoryScores as CategoryScores,
        strengths: fallbackReport.strengths,
        weaknesses: fallbackReport.weaknesses,
        suggestions: fallbackReport.suggestions,
      });

      return { report: fallbackReport };
    }

    // Save report to database
    await interviewRepository.createReport({
      interviewId: interview.id,
      overallScore: reportData.overallScore,
      summary: reportData.summary,
      categoryScores: reportData.categoryScores as CategoryScores,
      strengths: reportData.strengths,
      weaknesses: reportData.weaknesses,
      suggestions: reportData.suggestions,
    });

    return { report: reportData };
  }),
};
