import { ORPCError } from "@orpc/client";
import { env } from "@/config/env";
import { deepgram } from "@/lib/deepgram";
import { sttContract } from "../contracts/stt";

export const sttHandlers = {
  getToken: sttContract.getToken.handler(async ({ context }) => {
    const { user } = context;
    if (!user) throw new ORPCError("UNAUTHORIZED");

    try {
      const keyResult = await deepgram.manage.createProjectKey(
        env.DEEPGRAM_PROJECT_ID,
        {
          comment: "Client STT session key",
          scopes: ["usage:write"],
          tags: ["client-stt"],
          time_to_live_in_seconds: 300,
        },
      );

      if (!keyResult?.result?.key) {
        throw new Error("Failed to generate token: No key returned");
      }

      return { token: keyResult.result.key };
    } catch (error) {
      console.error("[STT Token Error]", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to generate STT token",
      });
    }
  }),
};
