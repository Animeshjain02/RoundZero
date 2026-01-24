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
            scopes: ["listen:live"],
            tags: ["web_client", "interview"],
            time_to_live_in_seconds: 120,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Deepgram API response:", response.status, errorText);
        throw new Error(
          `Deepgram API error: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();

      if (!data.key) {
        console.error("No key in response:", data);
        throw new Error("Deepgram did not return a key");
      }

      return { token: data.key };
    } catch (error) {
      console.error("Error generating STT token", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to generate STT token",
      });
    }
  }),
};
