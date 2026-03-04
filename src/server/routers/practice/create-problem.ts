import { ORPCError } from "@orpc/client";
import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";
import { z } from "zod";

import { systemDesignProblemSchema } from "@/lib/validations/practice";

export const createProblemInput = systemDesignProblemSchema;

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
