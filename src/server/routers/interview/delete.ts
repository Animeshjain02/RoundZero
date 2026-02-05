import { ORPCError } from "@orpc/client";
import { z } from "zod";

import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";

export const deleteInterviewInput = z.object({
  id: z.string().min(1, "Interview ID is required"),
});

export async function deleteInterview({
  input,
  context,
}: {
  input: z.infer<typeof deleteInterviewInput>;
  context: Context;
}) {
  const { user } = context;
  if (!user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  const result = await db.interview.deleteMany({
    where: { id: input.id, userId: user.id },
  });

  return { success: result.count > 0 };
}
