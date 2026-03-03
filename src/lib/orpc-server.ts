import "server-only";

import { createRouterClient } from "@orpc/server";
import type { RouterClient } from "@orpc/server";
import { appRouter } from "@/server/routers/app";
import { os_context } from "@/server/orpc";

declare global {
  var $client: RouterClient<typeof appRouter> | undefined;
}

/**
 * Initialize the server-side oRPC client.
 * This is shared across all requests for better SSR performance.
 * The context function is called per-request to provide fresh headers.
 */
export function initializeServerClient() {
  if (!globalThis.$client) {
    globalThis.$client = createRouterClient(appRouter, {
      context: async () => {
        // Headers will be provided per-request via Next.js
        const { headers } = await import("next/headers");
        return os_context({ headers: await headers() });
      },
    });
  }
  return globalThis.$client;
}

// Initialize immediately
initializeServerClient();

// Export the client for direct use
export const serverClient = globalThis.$client!;
