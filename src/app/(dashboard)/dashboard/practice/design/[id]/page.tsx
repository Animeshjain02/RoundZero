import {
  ArrowLeft,
  CheckSquare,
  Clock,
  Layers,
  MonitorPlay,
  ShieldAlert,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { serverClient } from "@/lib/orpc-server";
import { cn } from "@/lib/utils";
import { os_context } from "@/server/orpc";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const problem = await serverClient.practice.getProblem({ id });
    return {
      title: `${problem.title} | System Design`,
      description: problem.description,
    };
  } catch {
    return {
      title: "Problem Not Found",
    };
  }
}

const COMPLEXITY_MAP = {
  EASY: {
    label: "Easy",
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-amber-500",
    badge:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  HARD: {
    label: "Hard",
    dot: "bg-red-500",
    badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
} as const;

export default async function ProblemDetailsPage({
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
  } catch {
    notFound();
  }

  const complexity =
    COMPLEXITY_MAP[problem.complexity as keyof typeof COMPLEXITY_MAP] ||
    COMPLEXITY_MAP.MEDIUM;

  const totalSpecs =
    problem.functionalReqs.length + problem.nonFunctionalReqs.length;

  return (
    <div className="flex h-full w-full flex-col">
      {/* ── Dashboard Top Bar ── */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur-xs">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard/practice/design">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link
            href="/dashboard/practice/design"
            className="hover:text-foreground transition-colors"
          >
            System Design
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[300px]">
            {problem.title}
          </span>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 space-y-8 p-6 md:p-8 animate-in fade-in duration-500">
        {/* ── Hero / Overview Section ── */}
        <div className="flex flex-col gap-8 xl:flex-row xl:justify-between">
          <div className="space-y-4 max-w-4xl">
            <Badge
              variant="outline"
              className={cn("font-medium px-2.5 py-0.5", complexity.badge)}
            >
              <span
                className={cn("mr-2 h-1.5 w-1.5 rounded-full", complexity.dot)}
              />
              {complexity.label}
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {problem.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* ── Structured CTA Action Panel ── */}
          <Card className="w-full shrink-0 border-primary/20 bg-primary/5 shadow-sm xl:w-[320px]">
            <CardContent className="p-6 flex flex-col justify-center h-full space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Clock className="mr-1.5 h-3.5 w-3.5" /> Time Limit
                  </span>
                  <p className="text-lg font-semibold text-foreground">
                    45 mins
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Layers className="mr-1.5 h-3.5 w-3.5" /> Requirements
                  </span>
                  <p className="text-lg font-semibold text-foreground">
                    {totalSpecs} Specs
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full font-medium h-12 shadow-md hover:shadow-lg transition-all"
                  asChild
                >
                  <Link href={`/dashboard/practice/design/${problem.id}/arena`}>
                    <MonitorPlay className="mr-2 h-5 w-5" />
                    Launch Arena
                  </Link>
                </Button>
                <p className="text-[11px] text-center text-muted-foreground font-medium">
                  Your whiteboard session will auto-save.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* ── Requirements Grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Functional Card */}
          <Card className="shadow-sm border-border/60 bg-card overflow-hidden">
            <CardHeader className="border-b px-6 py-5 bg-transparent">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckSquare className="h-5 w-5 text-primary" />
                Functional Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/50">
                {problem.functionalReqs.map((req: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-4 px-6 py-4 hover:bg-muted/10 transition-colors"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary border border-primary/20">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/90 mt-0.5">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Non-Functional Card */}
          <Card className="shadow-sm border-border/60 bg-card overflow-hidden">
            <CardHeader className="border-b px-6 py-5 bg-transparent">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldAlert className="h-5 w-5 text-primary" />
                System Constraints
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/50">
                {problem.nonFunctionalReqs.map((req: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-4 px-6 py-4 hover:bg-muted/10 transition-colors"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary border border-primary/20">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/90 mt-0.5">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
