import type { InterviewWithReport } from "../schemas";

export function calculateTypeBreakdown(interviews: InterviewWithReport[]) {
  const counts = {
    TECHNICAL: 0,
    BEHAVIORAL: 0,
    SYSTEM_DESIGN: 0,
  };

  for (const interview of interviews) {
    if (interview.type in counts) {
      counts[interview.type as keyof typeof counts]++;
    }
  }

  return [
    {
      name: "Technical",
      value: counts.TECHNICAL,
      color: "var(--color-primary)",
    },
    { name: "Behavioral", value: counts.BEHAVIORAL, color: "#22c55e" },
    { name: "System Design", value: counts.SYSTEM_DESIGN, color: "#f97316" },
  ].filter((item) => item.value > 0);
}
