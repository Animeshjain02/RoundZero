"use client";

import { ArrowUpRight, ChevronRight, Code2, Target, Users } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  gradient: string;
  bgGradient: string;
}

const defaultActions: QuickAction[] = [
  {
    title: "Behavioral",
    description: "STAR method practice",
    icon: Users,
    href: "/dashboard/interview/create?type=behavioral",
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-500/10 to-amber-500/10",
  },
  {
    title: "Technical",
    description: "Coding & DSA",
    icon: Code2,
    href: "/dashboard/interview/create?type=coding",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    title: "System Design",
    description: "Architecture deep-dive",
    icon: Target,
    href: "/dashboard/interview/create?type=system",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/10 to-purple-500/10",
  },
];

interface QuickStartProps {
  actions?: QuickAction[];
}

export function QuickStart({ actions = defaultActions }: QuickStartProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quick Start</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-1"
          asChild
        >
          <Link href="/dashboard/interview/create">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Card
              className={`relative overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer group bg-linear-to-br ${action.bgGradient}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className={`h-12 w-12 rounded-2xl bg-linear-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-lg">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
