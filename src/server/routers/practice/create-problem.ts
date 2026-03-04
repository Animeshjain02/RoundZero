import { ORPCError } from "@orpc/client";
import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";
import { z } from "zod";

export const createProblemInput = z.object({
  title: z.string(),
  description: z.string(),
  functionalReqs: z.array(z.string()),
  nonFunctionalReqs: z.array(z.string()),
  complexity: z.string(),
});

export async function createProblem({
  input,
  context,
}: {
  input: z.infer<typeof createProblemInput>;
  context: Context;
}) {
  const { user } = context;
  if (!user) throw new ORPCError("UNAUTHORIZED");

  const problem = await db.systemDesignProblem.create({
    data: {
      ...input,
      createdBy: user.id,
    },
  });

  return problem;
}
