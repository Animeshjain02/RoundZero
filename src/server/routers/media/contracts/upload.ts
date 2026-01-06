import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";

export const uploadContract = {
  // Get presigned URL for upload
  getPresignedUrl: protectedProcedure
    .route({
      description: "Get a presigned S3 URL for uploading files directly",
      method: "POST",
      path: "/media/upload/presigned",
      summary: "Get Presigned Upload URL",
      tags: ["Media", "Upload"],
    })
    .input(
      z.object({
        filename: z.string().min(1),
        contentType: z.enum([
          "audio/wav",
          "audio/mpeg",
          "audio/webm",
          "application/pdf",
        ]),
        purpose: z.enum(["resume", "interview_audio"]),
        interviewId: z.string().optional(),
      }),
    )
    .output(
      z.object({
        url: z.string(),
        key: z.string(),
      }),
    ),
};
