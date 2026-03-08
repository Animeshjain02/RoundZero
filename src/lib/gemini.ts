import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ORPCError } from "@orpc/client";
import {
  generateObject,
  generateText,
  type ModelMessage,
  streamText,
} from "ai";
import { z } from "zod";
import { env } from "@/config/env";

// Initialize Google AI client
const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

// Model configuration
const MODEL_ID = "gemini-3.1-flash-lite-preview";
const model = google(MODEL_ID);

// Temperature settings for different use cases
export const TEMPERATURE = {
  CREATIVE: 0.9,
  CONVERSATIONAL: 0.7,
  BALANCED: 0.5,
  PRECISE: 0.3,
  DETERMINISTIC: 0.1,
} as const;

// Schema for the interview performance report
export const reportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categoryScores: z.object({
    communication: z.number().min(0).max(100),
    problemSolving: z.number().min(0).max(100),
    technicalKnowledge: z.number().min(0).max(100),
    codeQuality: z.number().min(0).max(100),
    timeManagement: z.number().min(0).max(100),
  }),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  suggestions: z.array(z.string()).min(1),
  summary: z.string().min(1),
});

export type Report = z.infer<typeof reportSchema>;

// Category scores type for type safety
export type CategoryScores = Report["categoryScores"];

// Message type for AI conversations
export type AIMessage = ModelMessage;

// Generate a single interview response
export const generateInterviewResponse = async (
  systemPrompt: string,
  messages: AIMessage[],
  temperature: number = TEMPERATURE.CONVERSATIONAL,
): Promise<string> => {
  const { text } = await generateText({
    model,
    system: systemPrompt,
    messages,
    temperature,
  });

  return text;
};

// Stream an interview response for lower perceived latency
export const streamInterviewResponse = (
  systemPrompt: string,
  messages: AIMessage[],
  temperature: number = TEMPERATURE.CONVERSATIONAL,
) => {
  return streamText({
    model,
    system: systemPrompt,
    messages,
    temperature,
  });
};

// Generate a structured interview report
export const generateReport = async (
  systemPrompt: string,
  messages: AIMessage[],
  temperature: number = TEMPERATURE.PRECISE,
): Promise<Report> => {
  const { object } = await generateObject({
    model,
    system: systemPrompt,
    messages,
    schema: reportSchema,
    temperature,
  });

  return object;
};

import {
  type GeneratedSystemDesignProblem,
  systemDesignProblemSchema,
} from "./validations/practice";

export const architectureEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categoryScores: z.object({
    scalability: z.number().min(0).max(100),
    reliability: z.number().min(0).max(100),
    availability: z.number().min(0).max(100),
    performance: z.number().min(0).max(100),
    security: z.number().min(0).max(100),
    maintainability: z.number().min(0).max(100),
    costOptimization: z.number().min(0).max(100),
  }),
  strengths: z.array(z.string()).min(1).max(5),
  bottlenecks: z.array(z.string()).min(1).max(5),
  suggestions: z.array(z.string()).min(1).max(5),
  summary: z.string().min(1),
});

export type ArchitectureEvaluation = z.infer<
  typeof architectureEvaluationSchema
>;

export type ArchitectureCategoryScores =
  ArchitectureEvaluation["categoryScores"];

// Generate a structured system design problem based on a topic
export const generateSystemDesignProblem = async (
  topic: string,
  temperature: number = TEMPERATURE.BALANCED,
): Promise<GeneratedSystemDesignProblem> => {
  const systemPrompt = `You are a Staff Engineer at FAANG crafting system design interview questions. 
  The user will provide a topic. Generate a highly realistic, challenging system design problem spec.
  Include specific, realistic numbers for scale (e.g., 500M DAU, 10k read QPS).`;

  const { object } = await generateObject({
    model,
    system: systemPrompt,
    prompt: `Topic: ${topic}`,
    schema: systemDesignProblemSchema,
    temperature,
  });

  return object;
};

interface ArchitectureEvaluationInput {
  problemTitle: string;
  problemDescription: string;
  functionalReqs: string[];
  nonFunctionalReqs: string[];
  complexity: string;
  architectureText: string;
}

export const generateArchitectureEvaluation = async (
  input: ArchitectureEvaluationInput,
  temperature: number = 0.2,
): Promise<ArchitectureEvaluation> => {
  const systemPrompt = `You are a Principal Architect at a top tech company reviewing system design solutions.
Your goal is to evaluate the architecture against the problem requirements and provide constructive feedback.

CRITICAL: You MUST respond with ONLY a valid JSON object. No markdown, no explanations, no additional text.
The JSON must exactly match this schema:
{
  "overallScore": number (0-100),
  "categoryScores": {
    "scalability": number (0-100),
    "reliability": number (0-100),
    "availability": number (0-100),
    "performance": number (0-100),
    "security": number (0-100),
    "maintainability": number (0-100),
    "costOptimization": number (0-100)
  },
  "strengths": array of 1-5 strings,
  "bottlenecks": array of 1-5 strings,
  "suggestions": array of 1-5 strings,
  "summary": string
}

Be strict but fair. Consider:
- Does the architecture address the functional requirements?
- Are the non-functional requirements (scale, latency, availability) met?
- Is the design appropriate for the complexity level?
- Are there obvious missing components or anti-patterns?
- Is the architecture cost-effective?

Provide specific, actionable feedback that helps the candidate improve.`;

  const userPrompt = `
# Problem: ${input.problemTitle}

## Description
${input.problemDescription}

## Functional Requirements
${input.functionalReqs.map((r, i) => `${i + 1}. ${r}`).join("\n")}

## Non-Functional Requirements
${input.nonFunctionalReqs.map((r, i) => `${i + 1}. ${r}`).join("\n")}

## Complexity Level
${input.complexity}

# Candidate's Architecture
${input.architectureText}

Respond with ONLY a valid JSON object matching the schema described in the system prompt.`;

  try {
    const { object } = await generateObject({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      schema: architectureEvaluationSchema,
      temperature,
    });

    return object;
  } catch (error) {
    console.error("Architecture evaluation failed:", error);
    throw new ORPCError("INTERNAL_ERROR", {
      message: "Failed to evaluate architecture. Please try again.",
    });
  }
};
