import { z } from "zod";
import { protectedProcedure } from "@/server/orpc";
import { getProblems } from "./get-problems";
import { getProblem } from "./get-problem";
import { createProblem, createProblemInput } from "./create-problem";
import { submitAttempt, submitAttemptInput } from "./submit-attempt";

export const practiceRouter = {
  getProblems: protectedProcedure
    .route({
      description: "Get all system design problems",
      method: "GET",
      path: "/practice/design/problems",
      summary: "Get Problems",
      tags: ["Practice"],
    })
    .input(z.object({}))
    .handler(getProblems),

  getProblem: protectedProcedure
    .route({
      description: "Get a specific system design problem",
      method: "GET",
      path: "/practice/design/problems/{id}",
      summary: "Get Problem",
      tags: ["Practice"],
    })
    .input(z.object({ id: z.string() }))
    .handler(getProblem),

  createProblem: protectedProcedure
    .route({
      description: "Create a new system design problem",
      method: "POST",
      path: "/practice/design/problems",
      summary: "Create Problem",
      tags: ["Practice"],
    })
    .input(createProblemInput)
    .handler(createProblem),

  submitAttempt: protectedProcedure
    .route({
      description: "Submit a system design architecture attempt",
      method: "POST",
      path: "/practice/design/submit",
      summary: "Submit Attempt",
      tags: ["Practice"],
    })
    .input(submitAttemptInput)
    .handler(submitAttempt),
};
