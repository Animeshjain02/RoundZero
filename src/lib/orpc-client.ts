"use client";

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { env } from "@/config/env";
import type { AppRouter } from "@/server/routers/app";

const link = new RPCLink({
  url: `${env.NEXT_PUBLIC_APP_URL}/api/orpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
});

export const orpcClient: RouterClient<AppRouter> = createORPCClient(link);

// Create tanstack query utils
export const orpc = createTanstackQueryUtils(orpcClient);
