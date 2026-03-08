// Message role type
export type MessageRole = "user" | "assistant" | "system";

export interface InterviewMessage {
  id: string;
  role: MessageRole;
  content: string;
  audioUrl: string | null;
  codeSnippet: string | null;
  language: string | null;
  createdAt: Date;
}

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
  companyName: string | null;
  jobDescription: string | null;
  messages: InterviewMessage[];
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
export interface Message extends InterviewMessage {
  timestamp?: string;
  isTyping?: boolean;
}
