"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const router = useRouter();

  const handleSignout = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out successfully");
        },
        onError: () => {
          toast.error("Failed to sign out");
        },
      },
    });
  };

  return handleSignout;
}
