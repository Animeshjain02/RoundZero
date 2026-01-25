import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";

// Period type for date range filtering
export const periodSchema = z.enum(["7d", "30d", "90d", "all"]);
export type Period = z.infer<typeof periodSchema>;

// Analytics data output schemas
const overviewSchema = z.object({
  totalInterviews: z.number(),
  avgScore: z.number().nullable(),
  totalPracticeTime: z.number(), // hours
  completionRate: z.number(),
  interviewsChange: z.number(),
  scoreChange: z.number(),
  timeChange: z.number(),
  completionChange: z.number(),
});

const scoreTrendItemSchema = z.object({
  date: z.string(),
  score: z.number(),
  interviews: z.number(),
});

const typeBreakdownItemSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});

const skillRadarItemSchema = z.object({
  skill: z.string(),
  current: z.number(),
  previous: z.number(),
});

const timeByWeekItemSchema = z.object({
  week: z.string(),
  technical: z.number(),
  behavioral: z.number(),
  systemDesign: z.number(),
});

const activityHeatmapItemSchema = z.object({
  date: z.string(),
  count: z.number(),
  score: z.number().nullable(),
});

const insightsSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export const analyticsContract = {
  // Get comprehensive analytics data for all charts
  getData: protectedProcedure
    .route({
      description: "Get comprehensive analytics data for dashboard charts",
      method: "GET",
      path: "/analytics",
      summary: "Get Analytics Data",
      tags: ["Analytics"],
    })
    .input(
      z.object({
        period: periodSchema.default("30d"),
      }),
    )
    .output(
      z.object({
        overview: overviewSchema,
        scoreTrend: z.array(scoreTrendItemSchema),
        typeBreakdown: z.array(typeBreakdownItemSchema),
        skillRadar: z.array(skillRadarItemSchema),
        timeByWeek: z.array(timeByWeekItemSchema),
        activityHeatmap: z.array(activityHeatmapItemSchema),
        insights: insightsSchema,
      }),
    ),
};

// Export types for use in handlers
export type AnalyticsOverview = z.infer<typeof overviewSchema>;
export type ScoreTrendItem = z.infer<typeof scoreTrendItemSchema>;
export type TypeBreakdownItem = z.infer<typeof typeBreakdownItemSchema>;
export type SkillRadarItem = z.infer<typeof skillRadarItemSchema>;
export type TimeByWeekItem = z.infer<typeof timeByWeekItemSchema>;
export type ActivityHeatmapItem = z.infer<typeof activityHeatmapItemSchema>;
export type AnalyticsInsights = z.infer<typeof insightsSchema>;
