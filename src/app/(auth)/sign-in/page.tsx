import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "../_components/LoginForm";

export const metadata = {
  title: "Sign In | Interview AI",
  description: "Sign in to your Interview AI account",
};

export default async function AuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="max-sm:px-5">
      <LoginForm />
    </div>
  );
}
