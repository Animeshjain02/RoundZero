import { exampleRouter } from "./example/example";
import { interviewRouter } from "./interview/interview";

export const appRouter = {
  example: exampleRouter,
  interview: interviewRouter,
};

export type AppRouter = typeof appRouter;
