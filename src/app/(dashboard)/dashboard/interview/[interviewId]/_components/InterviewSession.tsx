"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInterview } from "../_context/interview-context";
import { CodeEditor } from "./code-editor";
import { ControlBar } from "./control-bar";
import { InterviewChat } from "./interview-chat";
import { InterviewHeader } from "./interview-header";
import { InterviewStats } from "./interview-stats";
import { VideoFeed } from "./video-feed";

export function InterviewSession() {
  const {
    interview,
    status,
    messages,
    isRecording,
    isPlaying,
    toggleMic,
    sendMessage,
    startInterview,
    endInterview,
    isLoading,
    isEnding,
    interimTranscript,
  } = useInterview();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showMicReminder, setShowMicReminder] = useState(false);

  // Auto-start interview if in SETUP
  useEffect(() => {
    if (status === "SETUP" && !isLoading && interview) {
      startInterview();
    }
  }, [status, startInterview, isLoading, interview]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "IN_PROGRESS") {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Show mic reminder after AI finishes speaking and user hasn't started recording
  useEffect(() => {
    if (
      status === "IN_PROGRESS" &&
      !isPlaying &&
      !isRecording &&
      messages.length > 0
    ) {
      const timer = setTimeout(() => {
        setShowMicReminder(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowMicReminder(false);
    }
  }, [status, isPlaying, isRecording, messages.length]);

  // Hide mic reminder when user starts recording
  useEffect(() => {
    if (isRecording) {
      setShowMicReminder(false);
    }
  }, [isRecording]);

  if (isLoading || !interview) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Interview...
      </div>
    );
  }

  const isTechnical = interview.type === "TECHNICAL";

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* Header */}
      <InterviewHeader
        jobTitle={interview.jobTitle}
        interviewType={interview.type}
        duration={formatTime(elapsedTime)}
        status={status === "IN_PROGRESS" ? "live" : "connecting"}
      />

      {/* Stats bar */}
      <div className="flex justify-center py-1.5 border-b bg-muted/30">
        <InterviewStats
          questionsAnswered={messages.filter((m) => m.role === "user").length}
          totalQuestions={undefined}
          currentTopic={interview.techStack || "General"}
          techStack={interview.techStack ? interview.techStack.split(",") : []}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {isTechnical ? (
          <>
            {/* Left side - Chat Interface */}
            <div
              className={cn(
                "flex flex-col h-full overflow-hidden transition-all duration-300 border-r border-border/40 relative",
                isEditorExpanded ? "w-[40%]" : "w-1/2",
              )}
            >
              <InterviewChat
                messages={messages.map((m) => ({
                  id: m.id,
                  role: m.role,
                  content: m.content,
                  timestamp: m.createdAt
                    ? new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "",
                  isTyping: false,
                }))}
                isRecording={isRecording}
                isPlaying={isPlaying}
                onToggleMic={toggleMic}
                showMicReminder={showMicReminder}
                interimTranscript={interimTranscript}
                className="h-full w-full"
              />

              {/* User video floating at bottom left */}
              <div className="absolute bottom-4 left-4 w-32 h-24 rounded-xl overflow-hidden shadow-xl border-2 border-background z-20 bg-black">
                <VideoFeed
                  userName="You"
                  isVideoOn={true}
                  isMicOn={isRecording}
                  compact
                />
              </div>
            </div>

            {/* Right side - Code Editor */}
            <div
              className={cn(
                "flex flex-col h-full overflow-hidden transition-all duration-300 bg-[#1e1e1e]",
                isEditorExpanded ? "w-[60%]" : "w-1/2",
              )}
            >
              <CodeEditor
                className="h-full border-0 rounded-none"
                isExpanded={isEditorExpanded}
                onToggleExpand={() => setIsEditorExpanded(!isEditorExpanded)}
                onSubmit={(code) =>
                  sendMessage(`[CODE_SUBMISSION] ${code}`, code)
                }
              />
            </div>
          </>
        ) : (
          // Behavioral Layout - Full Chat Interface
          <div className="flex-1 flex flex-col relative h-full">
            <InterviewChat
              messages={messages.map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: m.createdAt
                  ? new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
                isTyping: false,
              }))}
              isRecording={isRecording}
              isPlaying={isPlaying}
              onToggleMic={toggleMic}
              showMicReminder={showMicReminder}
              interimTranscript={interimTranscript}
              className="h-full"
            />

            {/* User video floating at bottom right */}
            <div className="absolute bottom-6 right-6 w-48 h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-background bg-black z-20">
              <VideoFeed
                userName="You"
                isVideoOn={true}
                isMicOn={isRecording}
                compact
              />
            </div>
          </div>
        )}
      </div>

      <ControlBar
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        isMicOn={isRecording}
        onToggleMic={toggleMic}
        onEndInterview={() => endInterview(elapsedTime)}
        isEnding={isEnding}
      />
    </div>
  );
}
