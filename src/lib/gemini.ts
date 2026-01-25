import { createGoogleGenerativeAI } from "@ai-sdk/google";
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
const MODEL_ID = "gemini-2.5-flash-preview-09-2025";
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
