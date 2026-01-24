import { ORPCError } from "@orpc/client";
import { env } from "@/config/env";
import { sttContract } from "../contracts/stt";

export const sttHandlers = {
  getToken: sttContract.getToken.handler(async ({ context }) => {
    const { user } = context;
    if (!user) throw new ORPCError("UNAUTHORIZED");

    try {
      const response = await fetch(
        `https://api.deepgram.com/v1/projects/${env.DEEPGRAM_PROJECT_ID}/keys`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: `Ephemeral key for user ${user.id}`,
            scopes: ["usage:write"],
            tags: ["web_client"],
            time_to_live_in_seconds: 60,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Deepgram API error: ${response.statusText}`);
      }

      const data = await response.json();
      return { token: data.key };
    } catch (error) {
      console.error("[STT Token Error]", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to generate STT token",
      });
    }
  }),
};
