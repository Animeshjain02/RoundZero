import { ORPCError } from "@orpc/client";
import { z } from "zod";
import type { Edge, Node } from "@xyflow/react";
import {
  formatArchitectureForLLM,
  serializeArchitecture,
} from "@/lib/architecture-serializer";
import { generateArchitectureEvaluation } from "@/lib/gemini";
import db from "@/lib/prisma";
import type { Context } from "@/server/orpc";

export const evaluateArchitectureInput = z.object({
  problemId: z.string(),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
});

export type EvaluateArchitectureInput = z.infer<
  typeof evaluateArchitectureInput
>;

export async function evaluateArchitecture({
  input,
  context,
}: {
  input: EvaluateArchitectureInput;
  context: Context;
}) {
  const { user } = context;
  if (!user) throw new ORPCError("UNAUTHORIZED");

  const { problemId, nodes, edges } = input;

  const problem = await db.systemDesignProblem.findUnique({
    where: { id: problemId },
  });

  if (!problem)
    throw new ORPCError("NOT_FOUND", { message: "Problem not found" });

  // Serialize the architecture graph into an LLM-readable format
  let architectureText: string;
  try {
    const serialization = serializeArchitecture(
      nodes as Node[],
      edges as Edge[],
    );
    architectureText = formatArchitectureForLLM(serialization);
  } catch (error) {
    console.error("Serialization failed:", error);
    throw new ORPCError("BAD_REQUEST", {
      message:
        "Failed to serialize architecture. Please ensure your design has valid components.",
    });
  }

  // Generate AI evaluation
  const evaluation = await generateArchitectureEvaluation({
    problemTitle: problem.title,
    problemDescription: problem.description,
    functionalReqs: problem.functionalReqs,
    nonFunctionalReqs: problem.nonFunctionalReqs,
    complexity: problem.complexity,
    architectureText,
  });

  // Persist the attempt with AI feedback
  try {
    await db.systemDesignAttempt.create({
      data: {
        problemId,
        userId: user.id,
        architectureJson: { nodes, edges },
        aiFeedback: evaluation,
        score: evaluation.overallScore,
      },
    });
  } catch (error) {
    console.error("Failed to save evaluation attempt:", error);
    // Still return the evaluation even if the DB write fails
  }

  return {
    ...evaluation,
    savedToDatabase: true,
  };
}
