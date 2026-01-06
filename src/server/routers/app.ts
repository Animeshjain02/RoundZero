import { exampleRouter } from "./example/example";
import { interviewRouter } from "./interview/interview.router";
import { mediaRouter } from "./media/media.router";

export const appRouter = {
  example: exampleRouter,
  interview: interviewRouter,
  media: mediaRouter,
};

export type AppRouter = typeof appRouter;
