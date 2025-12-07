"use client";

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouter } from "@/server/routers/app";

const link = new RPCLink({
  url:
    typeof window !== "undefined" ? window.location.origin + "/api/orpc" : "",
  headers: {
    // Add any headers if needed
  },
});

export const orpcClient: RouterClient<AppRouter> = createORPCClient(link);
export const orpc = createTanstackQueryUtils(orpcClient);
