"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/orpc-client";
import {
  type InterviewStatus,
  INTERVIEW_STATUS,
} from "@/server/routers/interview/interview.schemas";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { CopyPlus, Loader2, Terminal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewCard } from "./interview-card";

const ITEMS_PER_PAGE = 12;

export function InterviewList() {
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | "ALL">(
    "ALL",
  );
  const queryClient = useQueryClient();

  // Memoize options so they only change when relevant deps change
  const infiniteOptions = useMemo(
    () =>
      orpc.interview.list.infiniteOptions({
        input: (pageParam) => ({
          limit: ITEMS_PER_PAGE,
          offset: pageParam ?? 0,
          status: statusFilter === "ALL" ? undefined : statusFilter,
        }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
          const currentCount = allPages.length * ITEMS_PER_PAGE;
          return currentCount < lastPage.total ? currentCount : undefined;
        },
      }),
    [statusFilter],
  );

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetching,
  } = useInfiniteQuery(infiniteOptions);

  // Flatten for rendering and memoize
  const interviews = useMemo(
    () => data?.pages.flatMap((p) => p.interviews) ?? [],
    [data],
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[280px] rounded-xl w-full" />
        ))}
      </div>
    );
  }

  // Error UI: use refetch instead of full reload
  if (error) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center rounded-xl border border-dashed p-8 bg-muted/30">
        <div className="p-4 rounded-full bg-red-500/10">
          <Terminal className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold">Failed to load interviews</h3>
        <p className="text-muted-foreground max-w-sm">
          Something went wrong while fetching your interview history. Please try
          again.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: infiniteOptions.queryKey,
              })
            }
          >
            Force Refresh
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (interviews.length === 0) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center gap-6 text-center rounded-2xl border border-dashed p-8 bg-muted/20 animate-in fade-in zoom-in-95 duration-500">
        <div className="p-6 rounded-full bg-primary/10 ring-8 ring-primary/5">
          <CopyPlus className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">
            No interviews found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {statusFilter !== "ALL"
              ? `You don't have any ${statusFilter
                  .toLowerCase()
                  .replace("_", " ")} interviews.`
              : "You haven't started any interviews yet. Start your first session to get AI-powered feedback."}
          </p>
        </div>
        {statusFilter === "ALL" && (
          <Button asChild size="lg" className="mt-2">
            <Link href="/dashboard/interview/create">Start New Interview</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex justify-end">
        <Select
          value={statusFilter}
          onValueChange={(val) =>
            setStatusFilter(val as InterviewStatus | "ALL")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Interviews</SelectItem>
            <SelectItem value={INTERVIEW_STATUS.COMPLETED}>
              Completed
            </SelectItem>
            <SelectItem value={INTERVIEW_STATUS.IN_PROGRESS}>
              In Progress
            </SelectItem>
            <SelectItem value={INTERVIEW_STATUS.FAILED}>Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            aria-label="Load more interviews"
            variant="outline"
            size="lg"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {/* Optional subtle indicator if background fetching is happening */}
      {isFetching && !isLoading && (
        <div className="text-center text-sm text-muted-foreground">
          Updating…
        </div>
      )}
    </div>
  );
}
