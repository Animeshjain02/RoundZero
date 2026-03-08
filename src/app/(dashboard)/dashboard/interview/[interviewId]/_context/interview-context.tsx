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

interface SendMessageOptions {
  codeSnippet?: string;
  language?: string;
}

const toClientMessage = (message: {
  id: string;
  role: string;
  content: string;
  audioUrl: string | null;
  codeSnippet?: string | null;
  language?: string | null;
  createdAt: Date;
}): Message | null => {
  if (!isValidRole(message.role)) {
    return null;
  }

  return {
    id: message.id,
    role: message.role,
    content: message.content,
    audioUrl: message.audioUrl,
    codeSnippet: message.codeSnippet ?? null,
    language: message.language ?? null,
    createdAt: message.createdAt,
  };
};

const mergeMessage = (messages: Message[], nextMessage: Message): Message[] => {
  const existingIndex = messages.findIndex(
    (message) => message.id === nextMessage.id,
  );

  if (existingIndex === -1) {
    return [...messages, nextMessage];
  }

  return messages.map((message) =>
    message.id === nextMessage.id ? nextMessage : message,
  );
};

export interface InterviewContextType {
  // State
  messages: Message[];
  isRecording: boolean;
  isPlaying: boolean;
  isConnecting: boolean;
  isHydrated: boolean;
  interviewId: string;
  status: InterviewStatus;
  interview: InterviewData | null | undefined;
  isLoading: boolean;
  isEnding: boolean;

  // Actions
  startInterview: () => Promise<void>;
  sendMessage: (text: string, options?: SendMessageOptions) => Promise<void>;
  endInterview: (durationSec: number) => Promise<void>;

  // Media Controls
  toggleMic: () => Promise<void>;
  stopAllMedia: () => void;

  // Transcripts
  transcript: string;
  interimTranscript: string;

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
  const [isHydrated, setIsHydrated] = useState(false);
  const isStartingRef = useRef(false);
  const sendMessageRef = useRef<
    | ((content: string, options?: SendMessageOptions) => Promise<void>)
    | undefined
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
    interimTranscript,
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

  useEffect(() => {
    if (isLoading || isHydrated || !interviewDataResult) {
      return;
    }

    const interview = interviewDataResult.interview;
    if (!interview) {
      setIsHydrated(true);
      return;
    }

    const hydratedMessages = interview.messages
      .map(toClientMessage)
      .filter((message): message is Message => message !== null);

    setStatus(interview.status as InterviewStatus);
    setMessages(hydratedMessages);
    setIsHydrated(true);
  }, [interviewDataResult, isHydrated, isLoading]);

  useEffect(() => stopAllMedia, [stopAllMedia]);

  const startInterview = useCallback(async () => {
    if (!interviewId || !isHydrated) {
      return;
    }

    if (isStartingRef.current || status !== "SETUP") {
      return;
    }

    isStartingRef.current = true;

    try {
      const response = await startInterviewMutation({ interviewId });
      const assistantMessage = toClientMessage(response.assistantMessage);

      if (assistantMessage) {
        setMessages((prev) => mergeMessage(prev, assistantMessage));
      }
      setStatus(response.status as InterviewStatus);

      if (response.status === "IN_PROGRESS") {
        try {
          await connectSTT();
        } catch (sttError) {
          console.log("STT failed", sttError);
        }
      }

      if (assistantMessage?.audioUrl) {
        playEncodedAudio(assistantMessage.audioUrl);
      }
    } catch (error) {
      console.error("[Interview Context] Failed to start:", error);
      toast.error("Failed to start interview");
    } finally {
      isStartingRef.current = false;
    }
  }, [
    interviewId,
    isHydrated,
    status,
    startInterviewMutation,
    playEncodedAudio,
    connectSTT,
  ]);

  const sendMessage = useCallback(
    async (content: string, options?: SendMessageOptions) => {
      if (!interviewId) return;

      const previousTranscript = transcript;
      const optimisticUserMessageId = `user-${Date.now()}`;

      const userMessage: Message = {
        id: optimisticUserMessageId,
        role: "user",
        content,
        audioUrl: null,
        codeSnippet: options?.codeSnippet ?? null,
        language: options?.language ?? null,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setTranscript("");

      try {
        const response = await chatMutation({
          interviewId,
          message: content,
          codeSnippet: options?.codeSnippet,
          language: options?.language,
        });

        const persistedUserMessage = toClientMessage(response.userMessage);
        const assistantMessage = response.assistantMessage
          ? toClientMessage(response.assistantMessage)
          : null;

        setMessages((prev) => {
          const withoutOptimisticMessage = prev.filter(
            (message) => message.id !== optimisticUserMessageId,
          );

          let nextMessages = withoutOptimisticMessage;

          if (persistedUserMessage) {
            nextMessages = mergeMessage(nextMessages, persistedUserMessage);
          }

          if (assistantMessage) {
            nextMessages = mergeMessage(nextMessages, assistantMessage);
          }

          return nextMessages;
        });

        if (assistantMessage?.audioUrl) {
          playEncodedAudio(assistantMessage.audioUrl);
        } else if (!assistantMessage) {
          toast.error("Your answer was saved, but the AI response failed.");
        }
      } catch (error) {
        console.error("[Interview Context] Chat error:", error);
        setMessages((prev) =>
          prev.filter((message) => message.id !== optimisticUserMessageId),
        );
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
    isHydrated,
    interviewId,
    status,
    interview: interviewDataResult?.interview,
    isLoading: isLoading || !isHydrated,
    isEnding,
    startInterview,
    sendMessage,
    endInterview,
    toggleMic,
    stopAllMedia,
    transcript,
    interimTranscript,
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
