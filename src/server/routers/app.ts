import { z } from "zod";
import { pub } from "../orpc";

export const appRouter = {
  hello: pub
    .input(z.object({ name: z.string() }))
    .handler(async ({ input }) => {
      return `Hello, ${input.name}!`;
    }),
};

export type AppRouter = typeof appRouter;
