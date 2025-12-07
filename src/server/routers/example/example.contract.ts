import { z } from "zod";
import { publicProcedure } from "@/server/orpc";

export const contract = {
  getExample: publicProcedure
    .route({
      description: "A test GET endpoint",
      method: "GET",
      path: "/test/example",
      summary: "Test Endpoint",
      tags: ["Example"],
    })
    .input(
      z
        .object({
          message: z.string().optional(),
        })
        .optional()
        .default({}),
    )
    .output(
      z.object({
        received: z.string().optional(),
        timestamp: z.string(),
      }),
    ),

  hello: publicProcedure
    .route({
      description: "A test GET endpoint",
      method: "GET",
      path: "/test/hello",
      summary: "Test Endpoint",
      tags: ["Example"],
    })
    .input(z.void())
    .output(
      z.object({
        message: z.string(),
      }),
    ),
};
