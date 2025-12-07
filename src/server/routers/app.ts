import { exampleRouter } from "./example/example";

export const appRouter = {
  example: exampleRouter,
};

export type AppRouter = typeof appRouter;
