"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/query";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AuthUIProvider
          authClient={authClient}
          navigate={router.push}
          replace={router.replace}
          onSessionChange={() => {
            router.refresh();
          }}
          Link={Link}
        >
          {children}
        </AuthUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
