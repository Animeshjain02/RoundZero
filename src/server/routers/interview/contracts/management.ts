import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";
import {
  experienceLevelSchema,
  interviewItemSchema,
  interviewStatusSchema,
  interviewTypeSchema,
  messageSchema,
  reportSchema,
} from "../interview.schemas";

// Pagination defaults
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const managementContract = {
  // Create a new interview session
  create: protectedProcedure
    .route({
      description: "Create a new interview session",
      method: "POST",
      path: "/interview/create",
      summary: "Create Interview",
      tags: ["Interview", "Management"],
    })
    .input(
      z.object({
        jobTitle: z.string().min(1, "Job title is required"),
        resumeText: z.string().min(1, "Resume text is required"),
        type: interviewTypeSchema,
        includeDSA: z.boolean(),
        experienceLevel: experienceLevelSchema,
        techStack: z.string().optional(),
        resumeKey: z.string().optional(),
        resumeFilename: z.string().optional(),
        resumeId: z.string().optional(),
      }),
    )
    .output(
      z.object({
        interviewId: z.string(),
      }),
    ),

  // List user's interviews with pagination
  list: protectedProcedure
    .route({
      description: "Get user's interviews with pagination",
      method: "GET",
      path: "/interview/list",
      summary: "List Interviews",
      tags: ["Interview", "Management"],
    })
    .input(
      z.object({
        limit: z.number().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
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

  // Get interview by ID with full details
  getById: protectedProcedure
    .route({
      description: "Get interview by ID",
      method: "GET",
      path: "/interview/{id}",
      summary: "Get Interview",
      tags: ["Interview", "Management"],
    })
    .input(
      z.object({
        id: z.string().min(1, "Interview ID is required"),
      }),
    )
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
            messages: z.array(messageSchema),
            report: reportSchema.nullable(),
          })
          .nullable(),
      }),
    ),

  // Get user's interview statistics
  stats: protectedProcedure
    .route({
      description: "Get user's interview statistics",
      method: "GET",
      path: "/interview/stats",
      summary: "Get Stats",
      tags: ["Interview", "Management"],
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

  // Delete an interview
  delete: protectedProcedure
    .route({
      description: "Delete an interview",
      method: "DELETE",
      path: "/interview/{id}",
      summary: "Delete Interview",
      tags: ["Interview", "Management"],
    })
    .input(
      z.object({
        id: z.string().min(1, "Interview ID is required"),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
      }),
    ),

  // Get aggregated skill progress from completed interviews
  skillProgress: protectedProcedure
    .route({
      description: "Get aggregated skill progress from completed interviews",
      method: "GET",
      path: "/interview/skill-progress",
      summary: "Get Skill Progress",
      tags: ["Interview", "Management"],
    })
    .input(z.object({}))
    .output(
      z.object({
        skills: z.array(
          z.object({
            name: z.string(),
            value: z.number(),
          }),
        ),
      }),
    ),
};
