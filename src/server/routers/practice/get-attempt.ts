import { ORPCError } from "@orpc/client";
import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";
import { z } from "zod";

export const getAttemptInput = z.object({
  problemId: z.string(),
});

export async function getAttempt({
  input,
  context,
}: {
  input: z.infer<typeof getAttemptInput>;
  context: Context;
}) {
  const { user } = context;
  if (!user) throw new ORPCError("UNAUTHORIZED");

  const attempt = await db.systemDesignAttempt.findFirst({
    where: { problemId: input.problemId, userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return attempt ?? null;
}
