import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";

export const sttContract = {
  // Transcribe audio file (fallback for WebSocket)
  transcribe: protectedProcedure
    .route({
      description: "Transcribe audio file using Deepgram REST API",
      method: "POST",
      path: "/media/stt/transcribe",
      summary: "Transcribe Audio",
      tags: ["Media", "STT"],
    })
    .input(
      z.object({
        audio: z.string(), // Base64 encoded audio
        mimetype: z.string().default("audio/webm"),
      }),
    )
    .output(
      z.object({
        transcript: z.string(),
      }),
    ),
};
