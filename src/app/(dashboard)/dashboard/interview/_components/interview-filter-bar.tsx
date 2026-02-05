"use client";

import { Check, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  INTERVIEW_STATUS,
  type InterviewStatus,
} from "@/server/routers/interview/schemas";

interface InterviewFilterBarProps {
  currentStatus: InterviewStatus | "ALL";
  onStatusChange: (status: InterviewStatus | "ALL") => void;
}

const FILTER_OPTIONS = [
  { label: "All Interviews", value: "ALL" },
  { label: "Completed", value: INTERVIEW_STATUS.COMPLETED },
  { label: "In Progress", value: INTERVIEW_STATUS.IN_PROGRESS },
  { label: "Failed", value: INTERVIEW_STATUS.FAILED },
  { label: "Setup", value: INTERVIEW_STATUS.SETUP },
];

export function InterviewFilterBar({
  currentStatus,
  onStatusChange,
}: InterviewFilterBarProps) {
  const activeLabel = FILTER_OPTIONS.find(
    (opt) => opt.value === currentStatus,
  )?.label;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-border/40 bg-background/50 backdrop-blur-sm"
            >
              <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <span>{activeLabel}</span>
              <ChevronDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            {FILTER_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onStatusChange(option.value as any)}
                className="flex items-center justify-between cursor-pointer"
              >
                {option.label}
                {currentStatus === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats indicators could go here */}
      <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span>In Progress</span>
        </div>
      </div>
    </div>
  );
}
