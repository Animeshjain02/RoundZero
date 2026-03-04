"use client";

import { ArrowRight, Clock, Layers, Server } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SystemDesignCardProps {
  problem: {
    id: string;
    title: string;
    description: string;
    complexity: string;
    functionalReqs: string[];
    nonFunctionalReqs: string[];
  };
}

export function SystemDesignCard({ problem }: SystemDesignCardProps) {
  const totalSpecs =
    problem.functionalReqs.length + problem.nonFunctionalReqs.length;

  const complexityConfig = {
    EASY: {
      label: "Easy",
      dot: "bg-emerald-500",
      badge:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
    },
    MEDIUM: {
      label: "Medium",
      dot: "bg-amber-500",
      badge:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
    },
    HARD: {
      label: "Hard",
      dot: "bg-red-500",
      badge: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20",
    },
  };

  const currentComplexity =
    complexityConfig[problem.complexity as keyof typeof complexityConfig] ||
    complexityConfig.MEDIUM;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-md bg-card">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn(
              "font-medium transition-colors border-transparent",
              currentComplexity.badge,
            )}
          >
            <span
              className={cn(
                "mr-1.5 h-1.5 w-1.5 rounded-full",
                currentComplexity.dot,
              )}
            />
            {currentComplexity.label}
          </Badge>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary/50 text-muted-foreground">
            <Server className="h-3.5 w-3.5" />
          </div>
        </div>

        <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {problem.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-6 pb-6">
        <CardDescription className="text-sm leading-relaxed line-clamp-3">
          {problem.description}
        </CardDescription>

        {/* Clean, horizontal metadata row */}
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            <span>{totalSpecs} Specs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>45m</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          variant="outline"
          className="w-full group/btn border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <Link href={`/dashboard/practice/design/${problem.id}`}>
            Review Challenge
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
