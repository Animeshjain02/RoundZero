import type { InterviewType } from "@prisma/client";
import db from "@/lib/prisma";

// Types for repository inputs
export interface CreateResumeInput {
  userId: string;
  title: string;
  content: string;
  fileUrl: string;
}

export interface CreateInterviewInput {
  userId: string;
  jobTitle: string;
  resumeText: string;
  type: InterviewType;
  techStack?: string;
  experienceLevel: string;
  includeDSA: boolean;
  resumeId?: string;
}

export interface GetInterviewsInput {
  userId: string;
  limit?: number;
  offset?: number;
  status?: "SETUP" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

export const interviewRepository = {
  // Create a new resume record
  async createResume(data: CreateResumeInput) {
    return db.resume.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        fileUrl: data.fileUrl,
      },
    });
  },

  // Create a new interview
  async createInterview(data: CreateInterviewInput) {
    return db.interview.create({
      data: {
        userId: data.userId,
        jobTitle: data.jobTitle,
        resumeText: data.resumeText,
        type: data.type,
        techStack: data.techStack,
        experienceLevel: data.experienceLevel,
        includeDSA: data.includeDSA,
        status: "SETUP",
        resumeId: data.resumeId,
      },
      select: {
        id: true,
      },
    });
  },

  // Get interview by ID
  async getById(id: string, userId: string) {
    return db.interview.findFirst({
      where: { id, userId },
      include: {
        messages: true,
        report: true,
        resume: true,
      },
    });
  },

  // Get user's interviews with pagination
  async getByUserId({
    userId,
    limit = 10,
    offset = 0,
    status,
  }: GetInterviewsInput) {
    return db.interview.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
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
    });
  },

  // Count user's interviews
  async countByUserId(
    userId: string,
    status?: "SETUP" | "IN_PROGRESS" | "COMPLETED" | "FAILED",
  ) {
    return db.interview.count({
      where: {
        userId,
        ...(status && { status }),
      },
    });
  },

  // Get user stats
  async getUserStats(userId: string) {
    const [totalSessions, completedInterviews, totalDuration] =
      await Promise.all([
        db.interview.count({ where: { userId } }),
        db.interview.findMany({
          where: { userId, status: "COMPLETED" },
          include: { report: { select: { overallScore: true } } },
        }),
        db.interview.aggregate({
          where: { userId },
          _sum: { durationSec: true },
        }),
      ]);

    const scores = completedInterviews
      .map((i) => i.report?.overallScore)
      .filter((s): s is number => s !== null && s !== undefined);

    const averageScore =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null;

    return {
      totalSessions,
      completedCount: completedInterviews.length,
      averageScore,
      totalDurationSec: totalDuration._sum.durationSec ?? 0,
    };
  },

  // Update interview status
  async updateStatus(
    id: string,
    userId: string,
    status: "SETUP" | "IN_PROGRESS" | "COMPLETED" | "FAILED",
  ) {
    return db.interview.update({
      where: { id, userId },
      data: { status },
    });
  },

  // Delete interview
  async delete(id: string, userId: string) {
    return db.interview.deleteMany({
      where: { id, userId },
    });
  },
};
