import type { MessageRole as SchemaMessageRole } from "@/server/routers/interview/schemas";

// Message role type
export type MessageRole = "user" | "assistant" | "system";

// Interview data type (simplified for client use)
export interface InterviewData {
  id: string;
  jobTitle: string;
  type: "TECHNICAL" | "BEHAVIORAL" | "SYSTEM_DESIGN";
  status: "SETUP" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  startedAt: Date;
  endedAt: Date | null;
  durationSec: number;
  resumeText: string | null;
  techStack: string | null;
  experienceLevel: string;
  includeDSA: boolean;
  messages: Array<{
    id: string;
    role: MessageRole;
    content: string;
    audioUrl: string | null;
    createdAt: Date;
  }>;
  report: {
    overallScore: number;
    categoryScores: {
      communication: number;
      problemSolving: number;
      technicalKnowledge: number;
      codeQuality: number;
      timeManagement: number;
    };
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    summary: string;
  } | null;
}

// Message type for UI
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp?: string;
  createdAt?: string | Date;
  audioUrl?: string | null;
  isTyping?: boolean;
  codeSnippet?: string | null;
  language?: string | null;
}
