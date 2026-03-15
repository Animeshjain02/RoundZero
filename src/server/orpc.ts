import { ORPCError, os } from "@orpc/server";
import { tryCatch } from "@/hooks/try-catch";
import { auth } from "@/lib/auth";
import dns from "dns";

// --- START DNS BYPASS PATCH ---
const originalLookup = dns.lookup;
// @ts-ignore
dns.lookup = (hostname: any, options: any, callback: any) => {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  
  const hostStr = hostname ? String(hostname).toLowerCase() : "";
  const isStorage = hostStr.includes("storage.dev");
  const isNeon = hostStr.includes("neon.tech");

  if (isStorage || isNeon) {
    const ip = isNeon ? "13.228.46.236" : "138.2.108.124";
    // console.log(`[DNS BYPASS] ${hostStr} -> ${ip}`);
    
    if (options && options.all) {
      return callback(null, [{ address: ip, family: 4 }]);
    }
    return callback(null, ip, 4);
  }

  return originalLookup(hostname, options, callback);
};
// --- END DNS BYPASS PATCH ---

export type Context = {
  user?: typeof auth.$Infer.Session.user;
  session?: typeof auth.$Infer.Session.session;
};

export const os_context = async (opts: {
  headers: Headers;
}): Promise<Context> => {
  const cookie = opts.headers.get("cookie") ?? "";

  console.log("[ORPC Context] Getting session...");
  const { data: session, error } = await tryCatch(
    auth.api.getSession({ headers: opts.headers }),
  );

  if (error) {
    console.error("[ORPC Context] Session error:", error);
  } else {
    console.log("[ORPC Context] Session found:", session ? "Yes" : "No");
  }

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

export const adminProcedure = protectedProcedure.use(
  async ({ context, next }) => {
    if (context.user?.role !== "admin") {
      throw new ORPCError("FORBIDDEN", {
        message: "Requires admin privileges",
      });
    }

    return next({
      context: {
        user: context.user,
        session: context.session,
      },
    });
  },
);
