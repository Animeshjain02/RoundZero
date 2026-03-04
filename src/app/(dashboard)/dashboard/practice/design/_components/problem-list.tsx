"use client";

import { useQuery } from "@tanstack/react-query";
import { type InferRouterOutputs } from "@orpc/server";
import { Search, Server, X, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { orpc } from "@/lib/orpc-client";
import { type AppRouter } from "@/server/routers/app";
import { SystemDesignCard } from "./system-design-card";

const COMPLEXITY_OPTIONS = ["ALL", "EASY", "MEDIUM", "HARD"] as const;
type Complexity = (typeof COMPLEXITY_OPTIONS)[number];

type Problem = InferRouterOutputs<AppRouter>["practice"]["getProblems"][number];

interface ProblemListProps {
  initialData: Problem[];
}

export function ProblemList({ initialData }: ProblemListProps) {
  const [search, setSearch] = useState("");
  const [complexity, setComplexity] = useState<Complexity>("ALL");
  const debouncedSearch = useDebounce(search, 400);

  // Memoize query options to prevent unnecessary re-renders (project pattern)
  const options = useMemo(
    () =>
      orpc.practice.getProblems.queryOptions({
        input: {
          search: debouncedSearch || undefined,
          complexity: complexity === "ALL" ? undefined : complexity,
        },
      }),
    [debouncedSearch, complexity],
  );

  // Check if we are in the initial unfiltered state
  const isInitialState = !debouncedSearch && complexity === "ALL";

  const { data: problems, isFetching } = useQuery({
    ...options,
    // Only use initialData if we are in the initial stae to avoid blocking filter updates
    initialData: isInitialState ? initialData : undefined,
    staleTime: 1000 * 60 * 2,
  });

  // Display initialData as fallback if query results aren't ready for the initial state
  const displayProblems = problems ?? (isInitialState ? initialData : []);

  const hasActiveFilters = search.length > 0 || complexity !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setComplexity("ALL");
  };

  return (
    <div className="space-y-6">
      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search challenges..."
            className="pl-9 pr-10 h-10 bg-secondary/30 border-border/40 text-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isFetching && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/60" />
            )}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-muted-foreground/60 hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <Tabs
          value={complexity}
          onValueChange={(v) => setComplexity(v as Complexity)}
        >
          <TabsList className="h-9 bg-secondary/30 rounded-xl p-0.5">
            {COMPLEXITY_OPTIONS.map((value) => (
              <TabsTrigger
                key={value}
                value={value}
                className="px-4 text-xs cursor-pointer font-semibold uppercase tracking-wider rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                {value === "ALL"
                  ? "All"
                  : value.charAt(0) + value.slice(1).toLowerCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ── Problem Grid ── */}
      {isFetching && !displayProblems.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-2xl" />
          ))}
        </div>
      ) : displayProblems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayProblems.map((problem) => (
            <SystemDesignCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-5 text-center rounded-2xl border border-dashed border-border/50 p-12 bg-muted/10">
          <div className="p-5 rounded-full bg-muted/30">
            <Server className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight">
              No challenges found
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "No system design problems are available yet."}
            </p>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="rounded-xl"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
