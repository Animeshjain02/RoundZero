import { ORPCError } from "@orpc/client";

import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";

export async function listResumes({ context }: { context: Context }) {
  const { user } = context;
  if (!user) throw new ORPCError("UNAUTHORIZED");

  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      content: true,
    },
  });

  return resumes;
}
