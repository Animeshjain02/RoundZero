import { ORPCError } from "@orpc/client";
import { analyticsContract } from "../contracts/analytics";
import {
  aggregateInsights,
  calculateHeatmap,
  calculateOverview,
  calculateScoreTrend,
  calculateSkillRadar,
  calculateTimeByWeek,
  calculateTypeBreakdown,
  getAnalyticsData,
  getDateRange,
} from "../analytics.repository";

export const analyticsHandlers = {
  // Get comprehensive analytics data for all charts
  getData: analyticsContract.getData.handler(async ({ input, context }) => {
    const { user } = context;

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const { period } = input;
    const { startDate, endDate } = getDateRange(period);

    // Fetch all data in parallel (per async-parallel best practice)
    const { currentInterviews, previousInterviews, heatmapInterviews } =
      await getAnalyticsData(user.id, startDate, endDate);

    // Calculate all chart data
    const overview = calculateOverview(currentInterviews, previousInterviews);
    const scoreTrend = calculateScoreTrend(currentInterviews);
    const typeBreakdown = calculateTypeBreakdown(currentInterviews);
    const skillRadar = calculateSkillRadar(
      currentInterviews,
      previousInterviews,
    );
    const timeByWeek = calculateTimeByWeek(currentInterviews);
    const activityHeatmap = calculateHeatmap(heatmapInterviews);
    const insights = aggregateInsights(currentInterviews);

    return {
      overview,
      scoreTrend,
      typeBreakdown,
      skillRadar,
      timeByWeek,
      activityHeatmap,
      insights,
    };
  }),
};
