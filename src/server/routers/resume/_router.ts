import { z } from "zod";

import { protectedProcedure } from "@/server/orpc";
import { listResumes } from "./list";
import { parseResume, parseResumeInput } from "./parse";
import { postInterviewRole, postInterviewRoleInput } from "./post-role";
import { analyze, analyzeResumeInput } from "./analyze";
import { analyzeText, analyzeTextInput } from "./analyze-text";
import { atsEvaluationSchema } from "@/lib/gemini";

export const resumeRouter = {
  postRole: protectedProcedure
    .route({
      description: "Post the Job Description, Skills and Resume",
      method: "POST",
      path: "/resume/role",
      summary: "Post the Job Description, Skills and Resume",
      tags: ["Resume"],
    })
    .input(postInterviewRoleInput)
    .output(
      z.object({
        message: z.string(),
        resumeText: z.string(),
      }),
    )
    .handler(postInterviewRole),

  parse: protectedProcedure
    .route({
      description: "Parse resume content from S3",
      method: "POST",
      path: "/resume/parse",
      summary: "Parse Resume",
      tags: ["Resume"],
    })
    .input(parseResumeInput)
    .output(
      z.object({
        text: z.string(),
      }),
    )
    .handler(parseResume),

  list: protectedProcedure
    .route({
      description: "List user's previously uploaded resumes",
      method: "GET",
      path: "/resume/list",
      summary: "List Resumes",
      tags: ["Resume"],
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          updatedAt: z.date(),
          content: z.string(),
        }),
      ),
    )
    .handler(listResumes),
    
  analyze: protectedProcedure
    .route({
      description: "Analyze resume for ATS score and feedback",
      method: "POST",
      path: "/resume/analyze",
      summary: "Analyze Resume",
      tags: ["Resume"],
    })
    .input(analyzeResumeInput)
    .output(atsEvaluationSchema)
    .handler(analyze),
    
  analyzeText: protectedProcedure
    .route({
      description: "Analyze resume text for ATS score and feedback",
      method: "POST",
      path: "/resume/analyze-text",
      summary: "Analyze Resume Text",
      tags: ["Resume"],
    })
    .input(analyzeTextInput)
    .output(atsEvaluationSchema)
    .handler(analyzeText),
};
