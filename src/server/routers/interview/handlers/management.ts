import { ORPCError } from "@orpc/client";
import { STORAGE_CONFIG } from "@/config/storage";
import { managementContract } from "../contracts/management";
import { interviewRepository } from "../interview.repository";
import type {
  CategoryScores,
  InterviewStatus,
  MESSAGE_ROLES,
} from "../interview.schemas";

export const managementHandlers = {
  // Create a new interview session
  create: managementContract.create.handler(async ({ input, context }) => {
    const { user } = context;

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const {
      jobTitle,
      resumeText,
      type,
      includeDSA,
      techStack,
      experienceLevel,
      resumeKey,
      resumeFilename,
    } = input;

    let resumeId: string | undefined;

    // Create resume record if file was uploaded
    if (resumeKey && resumeFilename) {
      try {
        const createdResume = await interviewRepository.createResume({
          userId: user.id,
          title: resumeFilename,
          content: resumeText,
          fileUrl: STORAGE_CONFIG.getPublicUrl(resumeKey),
        });
        resumeId = createdResume.id;
      } catch (error) {
        console.error("[Resume Creation Error]", error);
      }
    } else if (input.resumeId) {
      // Use existing resume - validate ownership
      const existingResume = await interviewRepository.getResumeById(
        input.resumeId,
        user.id,
      );

      if (!existingResume) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Invalid resume ID or access denied",
        });
      }

      resumeId = input.resumeId;
    }

    const interview = await interviewRepository.createInterview({
      userId: user.id,
      jobTitle,
      resumeText,
      type,
      techStack,
      experienceLevel,
      includeDSA,
      resumeId,
    });

    return { interviewId: interview.id };
  }),

  // List user's interviews with pagination
  list: managementContract.list.handler(async ({ input, context }) => {
    const { user } = context;
    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const { limit, offset, status } = input;

    const [interviews, total] = await Promise.all([
      interviewRepository.getByUserId({
        userId: user.id,
        limit,
        offset,
        status: status as InterviewStatus | undefined,
      }),
      interviewRepository.countByUserId(
        user.id,
        status as InterviewStatus | undefined,
      ),
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
  }),

  // Get interview by ID with all details
  getById: managementContract.getById.handler(async ({ input, context }) => {
    const { user } = context;
    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const interview = await interviewRepository.getById(input.id, user.id);

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
  }),

  // Get user's interview statistics
  stats: managementContract.stats.handler(async ({ context }) => {
    const { user } = context;
    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return interviewRepository.getUserStats(user.id);
  }),

  // Delete an interview
  delete: managementContract.delete.handler(async ({ input, context }) => {
    const { user } = context;
    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const result = await interviewRepository.delete(input.id, user.id);

    return { success: result.count > 0 };
  }),
};
