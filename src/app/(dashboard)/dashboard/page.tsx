import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardContent from "./_components/DashboardContent";

export const metadata = {
  title: "Dashboard | RoundZero",
  description: "Your personal dashboard for interview preparation",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return <DashboardContent user={session.user} />;
}
