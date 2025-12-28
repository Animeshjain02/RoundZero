import { exampleRouter } from "./example/example";
import { interviewRouter } from "./interview/interview.router";

export const appRouter = {
  example: exampleRouter,
  interview: interviewRouter,
};

export type AppRouter = typeof appRouter;
