import { ORPCError } from "@orpc/client";
import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";
import { z } from "zod";

export const submitAttemptInput = z.object({
  problemId: z.string(),
  architectureJson: z.any(),
  aiFeedback: z.any().optional(),
  score: z.number().optional(),
});

export async function submitAttempt({
  input,
  context,
}: {
  input: z.infer<typeof submitAttemptInput>;
  context: Context;
}) {
  const { user } = context;
  if (!user) throw new ORPCError("UNAUTHORIZED");

  const attempt = await db.systemDesignAttempt.create({
    data: {
      problemId: input.problemId,
      userId: user.id,
      architectureJson: input.architectureJson ?? {},
      aiFeedback: input.aiFeedback ?? {},
      score: input.score,
    },
  });

  return attempt;
}
