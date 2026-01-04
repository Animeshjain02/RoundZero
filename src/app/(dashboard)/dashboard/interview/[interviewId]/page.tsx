"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  AIAvatar,
  ChatSidebar,
  CodeEditor,
  ControlBar,
  InterviewHeader,
  InterviewStats,
  TranscriptBubble,
  VideoFeed,
  Waveform,
  type Message,
} from "./_components";

// Mock data
const mockMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! Welcome to your technical interview for the Senior Frontend Developer position. I'm your AI interviewer today.",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    role: "user",
    content:
      "Hi! Thank you for having me. I've been working as a frontend developer for about 5 years now.",
    timestamp: "10:01 AM",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Great! Let's start with a coding challenge. Please implement a function called twoSum that takes an array of numbers and a target, and returns the indices of two numbers that add up to the target.",
    timestamp: "10:02 AM",
  },
];

type InterviewType = "TECHNICAL" | "BEHAVIORAL" | "SYSTEM_DESIGN";

interface InterviewData {
  type: InterviewType;
  jobTitle: string;
  techStack: string[];
  currentTopic: string;
  questionsAnswered: number;
  totalQuestions: number;
}

const mockInterview: InterviewData = {
  type: "TECHNICAL",
  jobTitle: "Senior Frontend Developer",
  techStack: ["React", "TypeScript", "Next.js", "TailwindCSS"],
  currentTopic: "DSA - Two Sum",
  questionsAnswered: 2,
  totalQuestions: 6,
};

export default function InterviewPage() {
  const [isAISpeaking] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  const isTechnical = mockInterview.type === "TECHNICAL";

  const currentQuestion = isTechnical
    ? "Please implement a twoSum function that takes an array and a target number, returning indices of two numbers that add up to the target."
    : "Tell me about a time when you had to deal with a difficult team member. How did you handle the situation?";

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <InterviewHeader
        jobTitle={mockInterview.jobTitle}
        interviewType={mockInterview.type}
        duration="12:34"
        status="live"
      />

      {/* Stats bar */}
      <div className="flex justify-center py-3 border-b bg-muted/30">
        <InterviewStats
          questionsAnswered={mockInterview.questionsAnswered}
          totalQuestions={mockInterview.totalQuestions}
          currentTopic={mockInterview.currentTopic}
          techStack={mockInterview.techStack}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {isTechnical ? (
          <>
            {/* Left side - AI Avatar & Question */}
            <div
              className={cn(
                "flex flex-col transition-all duration-300 border-r relative",
                isEditorExpanded ? "w-[40%]" : "w-1/2"
              )}
            >
              <div className="absolute inset-0 bg-linear-to-br from-background to-muted/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

              <div className="relative flex-1 flex flex-col items-center justify-center gap-5 p-6 pb-32">
                <AIAvatar isSpeaking={isAISpeaking} name="Alex" size="md" />
                <Waveform isActive={isAISpeaking} className="h-10 w-full max-w-[250px]" barCount={24} />
                
                {/* Current question */}
                <div className="max-w-md text-center px-4">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                    Current Question
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    "{currentQuestion}"
                  </p>
                </div>
              </div>

              {/* User video */}
              <div className="absolute bottom-4 left-4 w-32 h-24 rounded-xl overflow-hidden shadow-xl border-2 border-background z-10">
                <VideoFeed userName="You" isVideoOn={true} isMicOn={true} compact />
              </div>
            </div>

            {/* Right side - Code Editor */}
            <div
              className={cn(
                "transition-all duration-300 p-3",
                isEditorExpanded ? "w-[60%]" : "w-1/2"
              )}
            >
              <CodeEditor
                className="h-full"
                isExpanded={isEditorExpanded}
                onToggleExpand={() => setIsEditorExpanded(!isEditorExpanded)}
              />
            </div>
          </>
        ) : (
          // Behavioral Layout - Full focus on conversation
          <div className="flex-1 flex flex-col relative">
            <div className="absolute inset-0 bg-linear-to-b from-background via-background to-muted/20" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

            <div className="relative flex-1 flex flex-col items-center justify-center gap-8 p-8">
              <AIAvatar isSpeaking={isAISpeaking} name="Alex" size="lg" />
              <Waveform isActive={isAISpeaking} className="h-16 w-full max-w-md" />
              <TranscriptBubble text={currentQuestion} speaker="ai" isLive={isAISpeaking} />
            </div>

            <div className="absolute bottom-24 right-6 w-64 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-background">
              <VideoFeed userName="John Doe" isVideoOn={true} isMicOn={true} compact />
            </div>
          </div>
        )}
      </div>

      {/* Control bar */}
      <ControlBar onToggleChat={() => setIsChatOpen(!isChatOpen)} isChatOpen={isChatOpen} />

      {/* Chat sidebar */}
      <ChatSidebar messages={mockMessages} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
