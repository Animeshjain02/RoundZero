import { z } from "zod";

import { protectedProcedure } from "@/server/orpc";
import { getPresignedUrl, getPresignedUrlInput } from "./get-presigned-url";
import { synthesize, synthesizeInput } from "./synthesize";
import { transcribe, transcribeInput } from "./transcribe";

export const mediaRouter = {
  getPresignedUrl: protectedProcedure
    .route({
      description: "Get a presigned S3 URL for uploading files directly",
      method: "POST",
      path: "/media/upload/presigned",
      summary: "Get Presigned Upload URL",
      tags: ["Media", "Upload"],
    })
    .input(getPresignedUrlInput)
    .output(
      z.object({
        url: z.string(),
        key: z.string(),
      }),
    )
    .handler(getPresignedUrl),

  transcribe: protectedProcedure
    .route({
      description: "Transcribe audio using Deepgram",
      method: "POST",
      path: "/media/stt/transcribe",
      summary: "Transcribe Audio",
      tags: ["Media", "STT"],
    })
    .input(transcribeInput)
    .output(
      z.object({
        transcript: z.string(),
      }),
    )
    .handler(transcribe),

  generate: protectedProcedure
    .route({
      description: "Convert text to speech using Deepgram",
      method: "POST",
      path: "/media/tts/generate",
      summary: "Generate Speech",
      tags: ["Media", "TTS"],
    })
    .input(synthesizeInput)
    .output(
      z.object({
        audioUrl: z.string(),
      }),
    )
    .handler(synthesize),
};
