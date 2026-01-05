import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";
import { resumeFileSchema, s3ResumeSchema } from "../interview.schemas";

export const resumeContract = {
  // Parse resume from base64 encoded file
  postInterviewRole: protectedProcedure
    .route({
      description: "Post the Job Description, Skills and Resume",
      method: "POST",
      path: "/interview/role",
      summary: "Post the Job Description, Skills and Resume",
      tags: ["Interview", "Resume"],
    })
    .input(
      z.object({
        jobRole: z.string().min(1, "Job role is required"),
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

  // Parse resume content from S3 storage
  parseResume: protectedProcedure
    .route({
      description: "Parse resume content from S3",
      method: "POST",
      path: "/interview/parse-resume",
      summary: "Parse Resume",
      tags: ["Interview", "Resume"],
    })
    .input(
      z.object({
        resume: s3ResumeSchema,
      }),
    )
    .output(
      z.object({
        text: z.string(),
      }),
    ),
};
