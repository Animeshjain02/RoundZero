import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";

export const contract = {
  postInterviewRole: protectedProcedure
    .route({
      description: "Post the Job Description, SKills and Resume",
      method: "POST",
      path: "/interview/role",
      summary: "Post the Job Description, SKills and Resume",
      tags: ["Interview"],
    })
    .input(
      z.object({
        jobRole: z.string().min(1),
        skills: z.array(z.string()),
        resume: z.object({
          filename: z.string().min(1),
          base64: z.string().min(1),
        }),
      }),
    )
    .output(
      z.object({
        message: z.string(),
        resumeText: z.string(),
      }),
    ),

  parseResume: protectedProcedure
    .route({
      description: "Parse resume content",
      method: "POST",
      path: "/interview/parse-resume",
      summary: "Parse Resume",
      tags: ["Interview"],
    })
    .input(
      z.object({
        resume: z.object({
          filename: z.string().min(1),
          base64: z.string().min(1),
        }),
      }),
    )
    .output(z.object({ text: z.string() })),

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
        type: z.enum(["TECHNICAL", "BEHAVIORAL", "SYSTEM_DESIGN"]),
        includeDSA: z.boolean(),
        experienceLevel: z.enum(["junior", "mid", "senior"]),
        techStack: z.string().optional(),
      }),
    )
    .output(z.object({ interviewId: z.string() })),
};
