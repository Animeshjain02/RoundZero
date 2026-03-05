import { ArrowLeft, MonitorPlay } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { serverClient } from "@/lib/orpc-server";
import { os_context } from "@/server/orpc";
import ArenaCanvas from "./_components/arena-canvas";
import { Badge } from "@/components/ui/badge";

export default async function ArenaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const context = await os_context({ headers: await headers() });

  if (!context.user) {
    redirect("/sign-in?error=session");
  }

  const { id } = await params;

  let problem;
  try {
    problem = await serverClient.practice.getProblem({ id });
  } catch (error) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="flex h-12 w-full shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-xs z-50">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Link href={`/dashboard/practice/design/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex items-center gap-2 text-sm">
            <Badge
              variant="outline"
              className="font-mono text-[10px] uppercase tracking-wider bg-primary/5 text-primary border-primary/20"
            >
              <MonitorPlay className="h-3 w-3 mr-1" /> Arena
            </Badge>
            <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-md hidden sm:inline-block">
              {problem.title}
            </span>
          </div>
        </div>
      </header>

      {/* ── React Flow Canvas ── */}
      <main className="flex-1 relative w-full h-full animate-in fade-in duration-500">
        <ArenaCanvas problemId={id} />
      </main>
    </div>
  );
}
