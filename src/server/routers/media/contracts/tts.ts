import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";

export const ttsContract = {
  // Generate TTS audio URL
  generate: protectedProcedure
    .route({
      description: "Generate TTS audio from text",
      method: "POST",
      path: "/media/tts/generate",
      summary: "Generate TTS",
      tags: ["Media", "TTS"],
    })
    .input(
      z.object({
        text: z.string().min(1).max(1000),
      }),
    )
    .output(
      z.object({
        audioUrl: z.string(),
      }),
    ),
};
