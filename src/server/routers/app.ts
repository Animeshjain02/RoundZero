import { analyticsRouter } from "./analytics/_router";
import { exampleRouter } from "./example/example";
import { interviewRouter } from "./interview/_router";
import { mediaRouter } from "./media/_router";
import { practiceRouter } from "./practice/_router";
import { resumeRouter } from "./resume/_router";

export const appRouter = {
  analytics: analyticsRouter,
  example: exampleRouter,
  interview: interviewRouter,
  media: mediaRouter,
  resume: resumeRouter,
  practice: practiceRouter,
};

export type AppRouter = typeof appRouter;
