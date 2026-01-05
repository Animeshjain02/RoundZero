import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";
import {
  durationSecSchema,
  interviewStatusSchema,
  reportSchema,
} from "../interview.schemas";

export const sessionContract = {
  // Start interview and get the first question
  start: protectedProcedure
    .route({
      description: "Start the interview and get the first question",
      method: "POST",
      path: "/interview/start",
      summary: "Start Interview",
      tags: ["Interview", "Session"],
    })
    .input(
      z.object({
        interviewId: z.string().min(1, "Interview ID is required"),
      }),
    )
    .output(
      z.object({
        message: z.string(),
        audioUrl: z.string().optional(),
        status: interviewStatusSchema,
      }),
    ),

  // Send a message and get an AI response
  chat: protectedProcedure
    .route({
      description: "Send a message and get an AI response",
      method: "POST",
      path: "/interview/chat",
      summary: "Chat",
      tags: ["Interview", "Session"],
    })
    .input(
      z.object({
        interviewId: z.string().min(1, "Interview ID is required"),
        message: z.string().min(1, "Message is required"),
        codeSnippet: z.string().optional(),
        language: z.string().optional(),
      }),
    )
    .output(
      z.object({
        message: z.string(),
        audioUrl: z.string().optional(),
        savedMessageId: z.string().optional(),
      }),
    ),

  // End the interview and generate a report
  end: protectedProcedure
    .route({
      description: "End the interview and generate a report",
      method: "POST",
      path: "/interview/end",
      summary: "End Interview",
      tags: ["Interview", "Session"],
    })
    .input(
      z.object({
        interviewId: z.string().min(1, "Interview ID is required"),
        durationSec: durationSecSchema,
      }),
    )
    .output(
      z.object({
        report: reportSchema,
      }),
    ),
};
