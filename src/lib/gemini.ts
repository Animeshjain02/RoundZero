import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  generateObject,
  generateText,
  streamText,
  type ModelMessage,
} from 'ai';
import { z } from 'zod';
import { env } from '@/config/env';

const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

const model = google('gemini-2.0-flash-001');

// Generate a single interview response
export const generateInterviewResponse = async (
  systemPrompt: string,
  messages: ModelMessage[]
) => {
  const { text } = await generateText({
    model,
    system: systemPrompt,
    messages,
    temperature: 0.7,
  });

  return text;
};

// Stream an interview response for lower perceived latency
export const streamInterviewResponse = async (
  systemPrompt: string,
  messages: ModelMessage[]
) => {
  return streamText({
    model,
    system: systemPrompt,
    messages,
    temperature: 0.7,
  });
};

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
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
  summary: z.string(),
});

export type Report = z.infer<typeof reportSchema>;

// Generate a structured interview report
export const generateReport = async (
  systemPrompt: string,
  messages: ModelMessage[]
) => {
  const { object } = await generateObject({
    model,
    system: systemPrompt,
    messages,
    schema: reportSchema,
    temperature: 0.3,
  });

  return object;
};
