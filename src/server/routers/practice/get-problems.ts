import { ORPCError } from "@orpc/client";
import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";

export async function getProblems({ context }: { context: Context }) {
  const { user } = context;
  if (!user) throw new ORPCError("UNAUTHORIZED");

  const problems = await db.systemDesignProblem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return problems;
}
