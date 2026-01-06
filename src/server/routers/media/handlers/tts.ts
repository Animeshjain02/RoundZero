import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ORPCError } from "@orpc/client";
import { v4 as uuidv4 } from "uuid";
import { STORAGE_CONFIG } from "@/config/storage";
import { textToSpeech } from "@/lib/deepgram";
import { S3 } from "@/lib/s3Client";
import { ttsContract } from "../contracts/tts";

export const ttsHandlers = {
  generate: ttsContract.generate.handler(async ({ input, context }) => {
    const { user } = context;
    if (!user) throw new ORPCError("UNAUTHORIZED");

    try {
      const audioBuffer = await textToSpeech(input.text);
      const key = `tts/${user.id}/${uuidv4()}.wav`;

      await S3.send(
        new PutObjectCommand({
          Bucket: STORAGE_CONFIG.bucketName,
          Key: key,
          Body: audioBuffer,
          ContentType: "audio/wav",
        }),
      );

      const audioUrl = STORAGE_CONFIG.getPublicUrl(key);
      return { audioUrl };
    } catch (error) {
      console.error("[TTS Generation Error]", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to generate audio",
      });
    }
  }),
};
