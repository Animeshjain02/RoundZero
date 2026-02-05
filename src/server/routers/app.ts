import { analyticsRouter } from "./analytics";
import { exampleRouter } from "./example/example";
import { interviewRouter } from "./interview/_router";
import { mediaRouter } from "./media/_router";
import { resumeRouter } from "./resume/_router";

export const appRouter = {
  analytics: analyticsRouter,
  example: exampleRouter,
  interview: interviewRouter,
  media: mediaRouter,
  resume: resumeRouter,
};

export type AppRouter = typeof appRouter;
