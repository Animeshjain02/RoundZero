import { z } from "zod";

import { protectedProcedure } from "@/server/orpc";
import { getDeepgramToken } from "./deepgram-token";
import { deleteFile, deleteFileInput } from "./delete-file";
import { getPresignedUrl, getPresignedUrlInput } from "./get-presigned-url";
import { synthesize, synthesizeInput } from "./synthesize";
import { transcribe, transcribeInput } from "./transcribe";
import { directUpload, directUploadInput } from "./direct-upload";

export const mediaRouter = {
  deepgramToken: protectedProcedure
    .route({
      description:
        "Get a temporary Deepgram API key for client-side Live STT WebSocket",
      method: "POST",
      path: "/media/stt/token",
      summary: "Get Deepgram Token",
      tags: ["Media", "STT"],
    })
    .output(
      z.object({
        apiKey: z.string(),
      }),
    )
    .handler(getDeepgramToken),

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

  deleteFile: protectedProcedure
    .route({
      description: "Delete a previously uploaded user-owned file",
      method: "DELETE",
      path: "/media/file",
      summary: "Delete Uploaded File",
      tags: ["Media", "Upload"],
    })
    .input(deleteFileInput)
    .output(
      z.object({
        success: z.boolean(),
      }),
    )
    .handler(deleteFile),

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
    
  upload: protectedProcedure
    .route({
      description: "Upload a file directly to the server (bypasses direct-to-S3 DNS issues)",
      method: "POST",
      path: "/media/upload/direct",
      summary: "Direct Upload",
      tags: ["Media", "Upload"],
    })
    .input(directUploadInput)
    .output(
      z.object({
        url: z.string(),
        key: z.string(),
      }),
    )
    .handler(directUpload),
};
