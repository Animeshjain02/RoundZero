import "server-only";

import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";
import { os_context } from "@/server/orpc";
import { appRouter } from "@/server/routers/app";

/**
 * Creates a fresh server-side oRPC client for the current request.
 */
export async function getServerClient() {
  const h = await headers();
  return createRouterClient(appRouter, {
    context: async () => {
      return os_context({ headers: h });
    },
  });
}

// Keep the old export for compatibility but it might be unreliable
export const serverClient = createRouterClient(appRouter, {
  context: async () => {
    return os_context({ headers: await headers() });
  },
});
