import { z } from "zod";

// Schema for generating a System Design Problem
export const systemDesignProblemSchema = z.object({
  title: z
    .string()
    .describe("Catchy title for the problem, e.g., 'Design Twitter'"),
  description: z
    .string()
    .describe(
      "A 2-3 paragraph detailed description of the problem context and objective.",
    ),
  functionalReqs: z
    .array(z.string())
    .min(2)
    .max(15)
    .describe(
      "List of core functional requirements (what the system MUST do).",
    ),
  nonFunctionalReqs: z
    .array(z.string())
    .min(2)
    .max(15)
    .describe("List of constraints (scale, latency, availability, DAU)."),
  complexity: z
    .enum(["EASY", "MEDIUM", "HARD"])
    .describe("Estimated difficulty of the interview problem."),
});

export type GeneratedSystemDesignProblem = z.infer<
  typeof systemDesignProblemSchema
>;
