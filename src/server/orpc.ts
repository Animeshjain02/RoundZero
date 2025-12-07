import { ORPCError, os } from "@orpc/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type Context = {
  user?: typeof auth.$Infer.Session.user;
  session?: typeof auth.$Infer.Session.session;
};

export const os_context = async (): Promise<Context> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    user: session?.user,
    session: session?.session,
  };
};

export const t = os.$context<Context>();
export const publicProcedure = t;
export const protectedProcedure = t.use(async ({ context, next }) => {
  if (!context.user || !context.session) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      user: context.user,
      session: context.session,
    },
  });
});
