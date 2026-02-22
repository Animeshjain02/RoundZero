"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { orpc } from "@/lib/orpc-client";
import type { INTERVIEW_STATUS } from "@/server/routers/interview/schemas";
import { useInterviewMedia } from "../_hooks/useInterviewMedia";
import type { InterviewData, Message } from "./types";

// Interview status type
type InterviewStatus = keyof typeof INTERVIEW_STATUS;

// Valid message roles
const VALID_ROLES = ["user", "assistant", "system"] as const;
const isValidRole = (role: string): role is Message["role"] => {
  return VALID_ROLES.includes(role as Message["role"]);
};

export interface InterviewContextType {
  // State
  messages: Message[];
  isRecording: boolean;
  isPlaying: boolean;
  isConnecting: boolean;
  interviewId: string;
  status: InterviewStatus;
  interview: InterviewData | null | undefined;
  isLoading: boolean;
  isEnding: boolean;

  // Actions
  startInterview: () => Promise<void>;
  sendMessage: (text: string, code?: string) => Promise<void>;
  endInterview: (durationSec: number) => Promise<void>;

  // Media Controls
  toggleMic: () => Promise<void>;
  stopAllMedia: () => void;

  // Transcripts
  transcript: string;

  // Connection state
  connectionState: "disconnected" | "connecting" | "connected" | "failed";
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export interface InterviewContextProviderProps {
  children: ReactNode;
  interviewId?: string;
}

export const InterviewContextProvider = ({
  children,
  interviewId: propInterviewId,
}: InterviewContextProviderProps) => {
  const params = useParams();
  const router = useRouter();

  // Validate interviewId
  const paramInterviewId = params?.interviewId;
  const interviewId =
    propInterviewId ||
    (typeof paramInterviewId === "string" ? paramInterviewId : "");

  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<InterviewStatus>("SETUP");
  const isStartingRef = useRef(false);
  // Ref to hold sendMessage for use in callbacks (solves ordering issue)
  const sendMessageRef = useRef<
    ((content: string, codeSnippet?: string) => Promise<void>) | undefined
  >(undefined);
  const isSendingRef = useRef(false);

  // Handle speech end: auto-submit transcript to AI
  const handleSpeechEnd = useCallback(async (finalTranscript: string) => {
    const trimmed = finalTranscript.trim();
    if (!trimmed || isSendingRef.current || !sendMessageRef.current) return;

    try {
      isSendingRef.current = true;
      console.log("[Interview Context] Sending user speech:", trimmed);
      await sendMessageRef.current(trimmed);
    } catch (error) {
      console.error("[Interview Context] Auto-send error:", error);
      toast.error("Failed to send your response");
    } finally {
      isSendingRef.current = false;
    }
  }, []);

  // Media management
  const {
    isPlaying,
    playEncodedAudio,
    isRecording,
    toggleMic,
    transcript,
    setTranscript,
    connectionState,
    connectSTT,
    stopAllMedia,
  } = useInterviewMedia(interviewId, {
    onSpeechEnd: handleSpeechEnd,
  });

  // API mutations using
  const { mutateAsync: startInterviewMutation } = useMutation(
    orpc.interview.start.mutationOptions(),
  );
  const { mutateAsync: chatMutation } = useMutation(
    orpc.interview.chat.mutationOptions(),
  );
  const { mutateAsync: endInterviewMutation, isPending: isEnding } =
    useMutation(orpc.interview.end.mutationOptions());

  // Fetch interview data using
  const { data: interviewDataResult, isLoading } = useQuery(
    orpc.interview.getById.queryOptions({
      input: { id: interviewId },
      enabled: !!interviewId,
    }),
  );

  // Initialize state from fetched data
  useEffect(() => {
    if (interviewDataResult?.interview) {
      const interview = interviewDataResult.interview;
      setStatus(interview.status as InterviewStatus);

      if (interview.messages) {
        const loadedMessages: Message[] = interview.messages
          .filter((m) => isValidRole(m.role))
          .map(
            (m: {
              id: string;
              role: string;
              content: string;
              audioUrl: string | null;
              createdAt: Date;
            }) => ({
              id: m.id,
              role: m.role as Message["role"],
              content: m.content,
              audioUrl: m.audioUrl,
              createdAt: m.createdAt,
            }),
          );
        setMessages(loadedMessages);
      }
    }
  }, [interviewDataResult]);

  // Start interview session
  const startInterview = useCallback(async () => {
    if (!interviewId) return;

    // Prevent duplicate starts
    if (isStartingRef.current || status === "IN_PROGRESS") {
      return;
    }

    isStartingRef.current = true;

    try {
      const response = await startInterviewMutation({ interviewId });

      const newMessage: Message = {
        id: `opening-${Date.now()}`,
        role: "assistant",
        content: response.message,
        audioUrl: response.audioUrl,
        createdAt: new Date(),
      };

      // Connect STT first, then update state
      try {
        await connectSTT();
      } catch (sttError) {
        console.log("STT failed", sttError);
      }

      setMessages((prev) => [...prev, newMessage]);
      setStatus("IN_PROGRESS");

      // Play the opening audio
      if (response.audioUrl) {
        playEncodedAudio(response.audioUrl);
      }
    } catch (error) {
      console.error("[Interview Context] Failed to start:", error);
      toast.error("Failed to start interview");
    } finally {
      isStartingRef.current = false;
    }
  }, [
    interviewId,
    status,
    startInterviewMutation,
    playEncodedAudio,
    connectSTT,
  ]);

  // Send a message to the AI interviewer
  const sendMessage = useCallback(
    async (content: string, codeSnippet?: string) => {
      if (!interviewId) return;

      // Store transcript for potential rollback
      const previousTranscript = transcript;
      const userMessageId = `user-${Date.now()}`;

      // Add user message optimistically
      const userMessage: Message = {
        id: userMessageId,
        role: "user",
        content,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setTranscript("");

      try {
        // Get AI response
        const response = await chatMutation({
          interviewId,
          message: content,
          codeSnippet,
        });

        // Add AI response
        const aiMessage: Message = {
          id: response.savedMessageId || `ai-${Date.now()}`,
          role: "assistant",
          content: response.message,
          audioUrl: response.audioUrl,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Play the response audio
        if (response.audioUrl) {
          playEncodedAudio(response.audioUrl);
        }
      } catch (error) {
        console.error("[Interview Context] Chat error:", error);
        // Rollback optimistic updates
        setMessages((prev) => prev.filter((m) => m.id !== userMessageId));
        setTranscript(previousTranscript);
        toast.error("Failed to send message");
      }
    },
    [interviewId, transcript, chatMutation, playEncodedAudio, setTranscript],
  );

  // Keep sendMessageRef in sync for use in callbacks
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  // End the interview and generate report
  const endInterview = useCallback(
    async (durationSec: number) => {
      if (!interviewId) return;

      try {
        await endInterviewMutation({ interviewId, durationSec });

        // Only stop media after successful mutation
        stopAllMedia();
        setStatus("COMPLETED");

        router.push(`/dashboard/interview/${interviewId}/report`);
        toast.success("Interview completed! Generating report...");
      } catch (error) {
        console.error("Interview context end error:", error);
        toast.error("Failed to end interview");
      }
    },
    [interviewId, endInterviewMutation, router, stopAllMedia],
  );

  const value: InterviewContextType = {
    messages,
    isRecording,
    isPlaying,
    isConnecting: connectionState === "connecting",
    interviewId,
    status,
    interview: interviewDataResult?.interview,
    isLoading,
    isEnding,
    startInterview,
    sendMessage,
    endInterview,
    toggleMic,
    stopAllMedia,
    transcript,
    connectionState,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

// Hook to access interview context
export const useInterview = (): InterviewContextType => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error(
      "useInterview must be used within InterviewContextProvider",
    );
  }
  return context;
};
