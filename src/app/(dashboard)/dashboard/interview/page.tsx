import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { listInterviews } from "@/server/routers/interview/list";
import { os_context } from "@/server/orpc";
import { InterviewList } from "./_components/interview-list";

export const metadata = {
  title: "My Interviews",
  description: "View and manage your AI interview sessions",
};

export default async function InterviewPage() {
  const context = await os_context();

  if (!context.user) {
    redirect("/sign-in?error=session");
  }

  // Fetch initial data on server
  const initialData = await listInterviews({
    context,
    input: {
      limit: 12,
      offset: 0,
    },
  });

  return (
    <div className="flex flex-col gap-8 p-8 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Interviews</h1>
          <p className="text-muted-foreground">
            Track your progress and review detailed performance reports.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold"
        >
          <Link href="/dashboard/interview/create">
            <Plus className="mr-2 h-5 w-5" />
            New Interview
          </Link>
        </Button>
      </div>

      <InterviewList initialData={initialData} />
    </div>
  );
}
