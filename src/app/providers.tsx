"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { getQueryClient } from "@/lib/query";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { authClient } from "@/lib/auth-client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";

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
