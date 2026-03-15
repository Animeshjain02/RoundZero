import { ORPCError } from "@orpc/client";
import { z } from "zod";
import type { Context } from "@/server/orpc";
import { analyzeResume } from "@/lib/gemini";

export const analyzeTextInput = z.object({
  text: z.string().min(1),
});

export async function analyzeText({
  input,
  context,
}: {
  input: z.infer<typeof analyzeTextInput>;
  context: Context;
}) {
  const { text } = input;
  const { user } = context;

  if (!user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  try {
    const analysis = await analyzeResume(text);
    return analysis;
  } catch (error) {
    console.error("[Resume Analysis AI Error]", error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to analyze resume with AI",
    });
  }
}
