"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OverallScoreCardProps {
  score: number;
}

export function OverallScoreCard({ score }: OverallScoreCardProps) {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-500";
    if (s >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Average";
    return "Needs Improvement";
  };

  const getRingColor = (s: number) => {
    if (s >= 80) return "stroke-emerald-500";
    if (s >= 60) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border/50 h-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative h-40 w-40 flex items-center justify-center mb-4">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-muted/20"
            />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className={cn("drop-shadow-md", getRingColor(score))}
              strokeDasharray={circumference}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-4xl font-bold tracking-tighter"
            >
              {Math.round(score)}
            </motion.span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              Overall
            </span>
          </div>
        </div>

        <h3
          className={cn(
            "text-2xl font-bold tracking-tight mb-1",
            getColor(score),
          )}
        >
          {getLabel(score)}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-[200px]">
          Based on your technical accuracy and communication skills.
        </p>
      </div>
    </div>
  );
}
