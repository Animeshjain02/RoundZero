import { z } from "zod";

import { protectedProcedure } from "@/server/orpc";
import { listResumes } from "./list";
import { parseResume, parseResumeInput } from "./parse";
import { postInterviewRole, postInterviewRoleInput } from "./post-role";

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
};
