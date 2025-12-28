import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";

// Shared schemas
export const interviewTypeSchema = z.enum([
  "TECHNICAL",
  "BEHAVIORAL",
  "SYSTEM_DESIGN",
]);
export const interviewStatusSchema = z.enum([
  "SETUP",
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
]);
export const experienceLevelSchema = z.enum(["junior", "mid", "senior"]);

export const resumeFileSchema = z.object({
  filename: z.string().min(1),
  base64: z.string().min(1),
});

export const s3ResumeSchema = z.object({
  filename: z.string().min(1),
  key: z.string().min(1),
});

// Interview item schema for lists
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

// Contract definitions
export const contract = {
  // Parse resume from base64
  postInterviewRole: protectedProcedure
    .route({
      description: "Post the Job Description, Skills and Resume",
      method: "POST",
      path: "/interview/role",
      summary: "Post the Job Description, Skills and Resume",
      tags: ["Interview"],
    })
    .input(
      z.object({
        jobRole: z.string().min(1),
        skills: z.array(z.string()),
        resume: resumeFileSchema,
      }),
    )
    .output(
      z.object({
        message: z.string(),
        resumeText: z.string(),
      }),
    ),

  // Parse resume from S3
  parseResume: protectedProcedure
    .route({
      description: "Parse resume content from S3",
      method: "POST",
      path: "/interview/parse-resume",
      summary: "Parse Resume",
      tags: ["Interview"],
    })
    .input(z.object({ resume: s3ResumeSchema }))
    .output(z.object({ text: z.string() })),

  // Create interview
  create: protectedProcedure
    .route({
      description: "Create a new interview session",
      method: "POST",
      path: "/interview/create",
      summary: "Create Interview",
      tags: ["Interview"],
    })
    .input(
      z.object({
        jobTitle: z.string().min(1),
        resumeText: z.string().min(1),
        type: interviewTypeSchema,
        includeDSA: z.boolean(),
        experienceLevel: experienceLevelSchema,
        techStack: z.string().optional(),
        resumeKey: z.string().optional(),
        resumeFilename: z.string().optional(),
      }),
    )
    .output(z.object({ interviewId: z.string() })),

  // Get user's interviews
  list: protectedProcedure
    .route({
      description: "Get user's interviews with pagination",
      method: "GET",
      path: "/interview/list",
      summary: "List Interviews",
      tags: ["Interview"],
    })
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
        status: interviewStatusSchema.optional(),
      }),
    )
    .output(
      z.object({
        interviews: z.array(interviewItemSchema),
        total: z.number(),
      }),
    ),

  // Get single interview
  getById: protectedProcedure
    .route({
      description: "Get interview by ID",
      method: "GET",
      path: "/interview/{id}",
      summary: "Get Interview",
      tags: ["Interview"],
    })
    .input(z.object({ id: z.string() }))
    .output(
      z.object({
        interview: z
          .object({
            id: z.string(),
            jobTitle: z.string(),
            type: interviewTypeSchema,
            status: interviewStatusSchema,
            startedAt: z.date(),
            endedAt: z.date().nullable(),
            durationSec: z.number(),
            resumeText: z.string().nullable(),
            techStack: z.string().nullable(),
            experienceLevel: z.string(),
            includeDSA: z.boolean(),
          })
          .nullable(),
      }),
    ),

  // Get dashboard stats
  stats: protectedProcedure
    .route({
      description: "Get user's interview statistics",
      method: "GET",
      path: "/interview/stats",
      summary: "Get Stats",
      tags: ["Interview"],
    })
    .input(z.object({}))
    .output(
      z.object({
        totalSessions: z.number(),
        completedCount: z.number(),
        averageScore: z.number().nullable(),
        totalDurationSec: z.number(),
      }),
    ),

  // Delete interview
  delete: protectedProcedure
    .route({
      description: "Delete an interview",
      method: "DELETE",
      path: "/interview/{id}",
      summary: "Delete Interview",
      tags: ["Interview"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() })),
};
