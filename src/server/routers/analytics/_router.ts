import { protectedProcedure } from "@/server/orpc";
import { getData } from "./get-data";
import { getDataInputSchema, getDataOutputSchema } from "./schemas";

export const analyticsRouter = {
  // Get comprehensive analytics data for all charts
  getData: protectedProcedure
    .route({
      description: "Get comprehensive analytics data for dashboard charts",
      method: "GET",
      path: "/analytics",
      summary: "Get Analytics Data",
      tags: ["Analytics"],
    })
    .input(getDataInputSchema)
    .output(getDataOutputSchema)
    .handler(getData),
};
