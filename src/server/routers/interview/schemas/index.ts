import { z } from "zod";
import {
  EXPERIENCE_LEVELS,
  INTERVIEW_TYPES,
} from "@/lib/prompts/interview-prompts";

// Interview type enum schema
export const interviewTypeSchema = z.enum([
  INTERVIEW_TYPES.TECHNICAL,
  INTERVIEW_TYPES.BEHAVIORAL,
  INTERVIEW_TYPES.SYSTEM_DESIGN,
]);

export type InterviewType = z.infer<typeof interviewTypeSchema>;

// Interview status enum schema
export const INTERVIEW_STATUS = {
  SETUP: "SETUP",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export const interviewStatusSchema = z.enum([
  INTERVIEW_STATUS.SETUP,
  INTERVIEW_STATUS.IN_PROGRESS,
  INTERVIEW_STATUS.COMPLETED,
  INTERVIEW_STATUS.FAILED,
]);

export type InterviewStatus = z.infer<typeof interviewStatusSchema>;

// Experience level enum schema
export const experienceLevelSchema = z.enum([
  EXPERIENCE_LEVELS.JUNIOR,
  EXPERIENCE_LEVELS.MID,
  EXPERIENCE_LEVELS.SENIOR,
]);

export type ExperienceLevel = z.infer<typeof experienceLevelSchema>;

// Message role enum
export const MESSAGE_ROLES = {
  SYSTEM: "system",
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export const messageRoleSchema = z.enum([
  MESSAGE_ROLES.SYSTEM,
  MESSAGE_ROLES.USER,
  MESSAGE_ROLES.ASSISTANT,
]);

export type MessageRole = z.infer<typeof messageRoleSchema>;

// Resume file schema (base64 upload)
export const resumeFileSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  base64: z.string().min(1, "File content is required"),
});

export type ResumeFile = z.infer<typeof resumeFileSchema>;

// S3 resume reference schema
export const s3ResumeSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  key: z.string().min(1, "S3 key is required"),
});

export type S3Resume = z.infer<typeof s3ResumeSchema>;

// Interview list item schema
export const interviewItemSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  type: interviewTypeSchema,
  status: interviewStatusSchema,
  startedAt: z.date(),
  endedAt: z.date().nullable(),
  durationSec: z.number(),
  score: z.number().nullable(),
});

export type InterviewItem = z.infer<typeof interviewItemSchema>;

// Message schema
export const messageSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  audioUrl: z.string().nullable(),
  codeSnippet: z.string().nullable(),
  language: z.string().nullable(),
  createdAt: z.date(),
});

export type Message = z.infer<typeof messageSchema>;

// Category scores schema
export const categoryScoresSchema = z.object({
  communication: z.number().min(0).max(100),
  problemSolving: z.number().min(0).max(100),
  technicalKnowledge: z.number().min(0).max(100),
  codeQuality: z.number().min(0).max(100),
  timeManagement: z.number().min(0).max(100),
});

export type CategoryScores = z.infer<typeof categoryScoresSchema>;

// Report schema
export const reportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categoryScores: categoryScoresSchema,
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
  summary: z.string(),
});

export type Report = z.infer<typeof reportSchema>;

// File size constants
export const FILE_LIMITS = {
  MAX_RESUME_SIZE_BYTES: 2 * 1024 * 1024, // 2 MB
  MAX_AUDIO_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
} as const;

// Duration schema with non-negative constraint
export const durationSecSchema = z.number().int().nonnegative();

// Allowed file extensions
export const ALLOWED_RESUME_EXTENSIONS = [".pdf", ".docx", ".txt"] as const;

export const isAllowedResumeExtension = (filename: string): boolean => {
  const lowerFilename = filename.toLowerCase();
  return ALLOWED_RESUME_EXTENSIONS.some((ext) => lowerFilename.endsWith(ext));
};
