"use client";

import { Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useInterview } from "../_context/interview-context";
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
} from ".";

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
    transcript,
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

  // Get last assistant message for the "Current Question" display
  const lastAssistantMessage =
    messages.filter((m) => m.role === "assistant").slice(-1)[0]?.content ||
    "Waiting for interviewer...";

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
      <div className="flex justify-center py-3 border-b bg-muted/30">
        <InterviewStats
          questionsAnswered={messages.filter((m) => m.role === "user").length}
          totalQuestions={undefined}
          currentTopic={interview.techStack || "General"}
          techStack={interview.techStack ? interview.techStack.split(",") : []}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {isTechnical ? (
          <>
            {/* Left side - AI Avatar & Question */}
            <div
              className={cn(
                "flex flex-col transition-all duration-300 border-r relative",
                isEditorExpanded ? "w-[40%]" : "w-1/2",
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20 -z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10" />

              <div className="relative flex-1 flex flex-col items-center justify-center gap-5 p-6 pb-32">
                <AIAvatar isSpeaking={isPlaying} name="Alex" size="md" />
                <Waveform
                  isActive={isPlaying}
                  className="h-10 w-full max-w-[250px]"
                  barCount={24}
                />

                {/* Current question */}
                <div className="max-w-md text-center px-4">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                    Current Question
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    "{lastAssistantMessage}"
                  </p>
                </div>

                {/* Live transcript display */}
                {(transcript || isRecording) && (
                  <div className="max-w-md w-full mt-4">
                    <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                          You're speaking
                        </span>
                      </div>
                      <p className="text-sm text-foreground min-h-6">
                        {transcript || "Listening..."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mic reminder */}
                {showMicReminder && !isRecording && (
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors mt-4"
                    onClick={toggleMic}
                  >
                    <Mic className="h-4 w-4" />
                    <span className="text-sm font-medium">Click to speak</span>
                  </button>
                )}
              </div>

              {/* User video */}
              <div className="absolute bottom-4 left-4 w-32 h-24 rounded-xl overflow-hidden shadow-xl border-2 border-background z-10 bg-black">
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
                "transition-all duration-300 p-3",
                isEditorExpanded ? "w-[60%]" : "w-1/2",
              )}
            >
              <CodeEditor
                className="h-full"
                isExpanded={isEditorExpanded}
                onToggleExpand={() => setIsEditorExpanded(!isEditorExpanded)}
                onSubmit={(code) =>
                  sendMessage(`[CODE_SUBMISSION] ${code}`, code)
                }
              />
            </div>
          </>
        ) : (
          // Behavioral Layout - Full focus on conversation
          <div className="flex-1 flex flex-col relative">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20 -z-10" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="relative flex-1 flex flex-col items-center justify-center gap-6 p-8 pb-32">
              <AIAvatar isSpeaking={isPlaying} name="Alex" size="lg" />
              <Waveform isActive={isPlaying} className="h-16 w-full max-w-md" />
              <TranscriptBubble
                text={lastAssistantMessage}
                speaker="ai"
                isLive={isPlaying}
              />

              {/* Live transcript display for behavioral */}
              {(transcript || isRecording) && (
                <div className="max-w-md w-full">
                  <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                        You're speaking
                      </span>
                    </div>
                    <p className="text-sm text-foreground min-h-6">
                      {transcript || "Listening..."}
                    </p>
                  </div>
                </div>
              )}

              {/* Mic reminder for behavioral */}
              {showMicReminder && !isRecording && (
                <button
                  type="button"
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                  onClick={toggleMic}
                >
                  <Mic className="h-4 w-4" />
                  <span className="text-sm font-medium">Click to speak</span>
                </button>
              )}
            </div>

            <div className="absolute bottom-24 right-6 w-64 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-background bg-black z-10">
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

      {/* Control bar */}
      <ControlBar
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        isMicOn={isRecording}
        onToggleMic={toggleMic}
        onEndInterview={() => endInterview(elapsedTime)}
        isEnding={isEnding}
      />

      {/* Chat sidebar */}
      <ChatSidebar
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
        }))}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
