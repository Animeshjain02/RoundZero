import { createTemporaryApiKey } from "@/lib/deepgram";
import type { Context } from "@/server/orpc";

// Generates a temp token
export async function getDeepgramToken({ context }: { context: Context }) {
  if (!context.user) {
    throw new Error("UNAUTHORIZED");
  }

  const apiKey = await createTemporaryApiKey(600); // 10 minutes TTL

  return { apiKey };
}
