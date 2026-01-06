import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";

export const sttContract = {
  // Get temporary Deepgram token for client
  getToken: protectedProcedure
    .route({
      description: "Get ephemeral Deepgram API key for client-side usage",
      method: "GET",
      path: "/media/stt/token",
      summary: "Get STT Token",
      tags: ["Media", "STT"],
    })
    .input(z.object({}))
    .output(
      z.object({
        token: z.string(),
      }),
    ),
};
