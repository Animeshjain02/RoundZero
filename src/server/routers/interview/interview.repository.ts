import db from "@/lib/prisma";
import {
  type CategoryScores,
  INTERVIEW_STATUS,
  type InterviewStatus,
  type InterviewType,
  type MessageRole,
} from "./interview.schemas";

// Input types for repository operations
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
  status?: InterviewStatus;
}

export interface CreateMessageInput {
  interviewId: string;
  role: MessageRole;
  content: string;
  audioUrl?: string;
  codeSnippet?: string;
  language?: string;
}

export interface CreateReportInput {
  interviewId: string;
  overallScore: number;
  summary: string;
  categoryScores: CategoryScores;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

// Default pagination values
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

// Interview repository for database operations
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
        status: INTERVIEW_STATUS.SETUP,
        resumeId: data.resumeId,
      },
      select: {
        id: true,
      },
    });
  },

  // Get interview by ID with all related data
  async getById(id: string, userId: string) {
    return db.interview.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        report: true,
        resume: true,
      },
    });
  },

  // Get user's interviews with pagination
  async getByUserId({
    userId,
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
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
  async countByUserId(userId: string, status?: InterviewStatus) {
    return db.interview.count({
      where: {
        userId,
        ...(status && { status }),
      },
    });
  },

  // Get user statistics
  async getUserStats(userId: string) {
    const [totalSessions, completedInterviews, totalDuration] =
      await Promise.all([
        db.interview.count({ where: { userId } }),
        db.interview.findMany({
          where: { userId, status: INTERVIEW_STATUS.COMPLETED },
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
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
          10
        : null;

    return {
      totalSessions,
      completedCount: completedInterviews.length,
      averageScore,
      totalDurationSec: totalDuration._sum.durationSec ?? 0,
    };
  },

  // Update interview status
  async updateStatus(id: string, userId: string, status: InterviewStatus) {
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

  // Add a message to an interview
  async addMessage(data: CreateMessageInput) {
    return db.message.create({
      data: {
        interviewId: data.interviewId,
        role: data.role,
        content: data.content,
        audioUrl: data.audioUrl,
        codeSnippet: data.codeSnippet,
        language: data.language,
      },
    });
  },

  // Get all messages for an interview
  async getMessages(interviewId: string) {
    return db.message.findMany({
      where: { interviewId },
      orderBy: { createdAt: "asc" },
    });
  },

  // Create report for interview
  async createReport(data: CreateReportInput) {
    return db.report.create({
      data: {
        interviewId: data.interviewId,
        overallScore: data.overallScore,
        summary: data.summary,
        categoryScores: data.categoryScores,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        suggestions: data.suggestions,
      },
    });
  },

  // Update interview duration and end time
  async updateDuration(id: string, userId: string, durationSec: number) {
    return db.interview.update({
      where: { id, userId },
      data: {
        durationSec,
        endedAt: new Date(),
      },
    });
  },

  // Get all resumes by user ID
  async getResumesByUserId(userId: string) {
    return db.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        content: true,
      },
    });
  },

  // Get single resume by ID and user ID
  async getResumeById(id: string, userId: string) {
    return db.resume.findFirst({
      where: { id, userId },
    });
  },
};
