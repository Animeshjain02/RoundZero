import type { Period } from "./schemas";

// Helper to get date key in local format (YYYY-MM-DD)
export function getLocalDateKey(date: Date): string {
  return date.toLocaleDateString("en-CA");
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Get date range based on period
export function getDateRange(period: Period): {
  startDate: Date;
  endDate: Date;
} {
  const now = new Date();
  const endDate = new Date(now);

  let startDate: Date;

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "all":
      startDate = new Date(0); // Beginning of time
      break;
  }

  return { startDate, endDate };
}

// Normalize strings for better aggregation
export function normalizeInsightString(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

// Safe score extraction with runtime type checking
export function safeGetScore(scores: unknown, key: string): number | null {
  if (
    scores &&
    typeof scores === "object" &&
    key in scores &&
    typeof (scores as Record<string, unknown>)[key] === "number"
  ) {
    return (scores as Record<string, number>)[key];
  }
  return null;
}
