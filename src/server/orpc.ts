import { ORPCError, os } from "@orpc/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/hooks/try-catch";

export type Context = {
  user?: typeof auth.$Infer.Session.user;
  session?: typeof auth.$Infer.Session.session;
};

export const os_context = async (): Promise<Context> => {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  const { data: session, error } = await tryCatch(
    auth.api.getSession({ headers: { cookie } }),
  );

  if (error || !session) {
    return {};
  }

  return {
    user: session.user,
    session: session.session,
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
