import { createClient } from "@deepgram/sdk";
import { ORPCError } from "@orpc/client";
import { env } from "@/config/env";
import { sttContract } from "../contracts/stt";

export const sttHandlers = {
  transcribe: sttContract.transcribe.handler(async ({ input, context }) => {
    const { user } = context;
    if (!user) throw new ORPCError("UNAUTHORIZED");

    try {
      const deepgram = createClient(env.DEEPGRAM_API_KEY);

      const audioBuffer = Buffer.from(input.audio, "base64");

      const { result, error } =
        await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
          mimetype: input.mimetype,
          model: "nova-2",
          smart_format: true,
          detect_language: false,
          language: "en-US",
        });

      if (error) {
        console.error("[STT Transcribe] Deepgram error:", error);
        throw new Error(`Deepgram transcription failed: ${error.message}`);
      }

      const transcript =
        result?.results?.channels[0]?.alternatives[0]?.transcript || "";
      return { transcript };
    } catch (error: any) {
      console.error("[STT Transcribe] Error:", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to transcribe audio",
      });
    }
  }),
};
