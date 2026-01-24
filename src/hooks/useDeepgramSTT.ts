import { createClient, type ListenLiveClient } from "@deepgram/sdk";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { orpc } from "@/lib/orpc-client";

// Connection states
export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "failed";

// STT configuration
const STT_CONFIG = {
  MODEL: "nova-2",
  LANGUAGE: "en-US",
  SMART_FORMAT: true,
  INTERIM_RESULTS: true,
  UTTERANCE_END_MS: 1500, // Increased for more natural pauses
  VAD_EVENTS: true,
  ENDPOINTING: 300, // End of speech detection in ms
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
} as const;

export interface DeepgramSTTState {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendAudio: (data: Blob) => void;
  connectionState: ConnectionState;
  transcript: string;
  setTranscript: React.Dispatch<React.SetStateAction<string>>;
  isListening: boolean;
  setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DeepgramSTTOptions {
  onUtteranceEnd?: (finalTranscript: string) => void;
  onInterimTranscript?: (text: string) => void;
}

// Hook to manage Deepgram WebSocket connection for Speech-to-Text
export const useDeepgramSTT = (
  options?: DeepgramSTTOptions,
): DeepgramSTTState => {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  const deepgramClientRef = useRef<ListenLiveClient | null>(null);
  const connectionAttempts = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  // Track transcript in ref for use in event handlers (avoids stale closure)
  const transcriptRef = useRef<string>("");
  const onUtteranceEndRef = useRef(options?.onUtteranceEnd);
  const onInterimTranscriptRef = useRef(options?.onInterimTranscript);
  // Track interim transcript separately
  const interimTranscriptRef = useRef<string>("");

  // Keep refs in sync
  useEffect(() => {
    onUtteranceEndRef.current = options?.onUtteranceEnd;
    onInterimTranscriptRef.current = options?.onInterimTranscript;
  }, [options?.onUtteranceEnd, options?.onInterimTranscript]);

  // Fetch STT token
  const { refetch: fetchToken } = useQuery({
    ...orpc.media.getToken.queryOptions({ input: {} }),
    enabled: false,
    retry: false,
  });

  const disconnect = useCallback(() => {
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (deepgramClientRef.current) {
      deepgramClientRef.current.requestClose();
      deepgramClientRef.current = null;
    }
    setConnectionState("disconnected");
    setIsListening(false);
  }, []);

  const connect = useCallback(async () => {
    // Prevent duplicate connections
    if (connectionState === "connected" || connectionState === "connecting") {
      return;
    }

    try {
      setConnectionState("connecting");

      const { data } = await fetchToken();

      if (!data?.token) {
        throw new Error("Failed to get STT token");
      }

      if (!isMountedRef.current) return;

      const deepgram = createClient(data.token);

      const connection = deepgram.listen.live({
        model: STT_CONFIG.MODEL,
        language: STT_CONFIG.LANGUAGE,
        smart_format: STT_CONFIG.SMART_FORMAT,
        interim_results: STT_CONFIG.INTERIM_RESULTS,
        utterance_end_ms: STT_CONFIG.UTTERANCE_END_MS,
        vad_events: STT_CONFIG.VAD_EVENTS,
        endpointing: STT_CONFIG.ENDPOINTING,
      });

      connection.on("Open", () => {
        if (!isMountedRef.current) return;
        console.log("[Deepgram STT] Connected");
        setConnectionState("connected");
        setIsListening(true);
        connectionAttempts.current = 0;
      });

      connection.on("Results", (data) => {
        if (!isMountedRef.current) return;
        const result = data.channel?.alternatives?.[0];
        if (result?.transcript) {
          if (data.is_final) {
            // Final result - append to transcript
            setTranscript((prev) => {
              const newTranscript = prev
                ? `${prev} ${result.transcript}`
                : result.transcript;
              transcriptRef.current = newTranscript;
              return newTranscript;
            });
            // Clear interim
            setInterimTranscript("");
            interimTranscriptRef.current = "";
          } else {
            // Interim result - update state for live feedback
            setInterimTranscript(result.transcript);
            interimTranscriptRef.current = result.transcript;
            onInterimTranscriptRef.current?.(result.transcript);
          }
        }
      });

      connection.on("Close", (event) => {
        if (!isMountedRef.current) return;
        console.log("[Deepgram STT] Disconnected", event);
        setConnectionState("disconnected");
        setIsListening(false);
      });

      connection.on("Error", (error) => {
        if (!isMountedRef.current) return;
        console.error("[Deepgram STT] Error:", error);
        setConnectionState("disconnected");
      });

      // UtteranceEnd fires when user stops speaking (silence detected)
      connection.on("UtteranceEnd", () => {
        if (!isMountedRef.current) return;
        console.log("[Deepgram STT] Utterance ended");
        const currentTranscript = transcriptRef.current.trim();
        if (currentTranscript && onUtteranceEndRef.current) {
          console.log("[Deepgram STT] Sending transcript:", currentTranscript);
          onUtteranceEndRef.current(currentTranscript);
          // Clear transcript after sending to treat each utterance as a new turn
          setTranscript("");
          setInterimTranscript("");
          transcriptRef.current = "";
          interimTranscriptRef.current = "";
        }
      });

      // SpeechStarted event for UI feedback
      connection.on("SpeechStarted", () => {
        if (!isMountedRef.current) return;
        console.log("[Deepgram STT] Speech started");
      });

      deepgramClientRef.current = connection;
    } catch (error) {
      console.error("[Deepgram STT] Failed to connect:", error);

      if (!isMountedRef.current) return;

      // Retry logic with exponential backoff
      if (connectionAttempts.current < STT_CONFIG.MAX_RETRIES) {
        connectionAttempts.current += 1;
        const delay = STT_CONFIG.RETRY_DELAY_MS * connectionAttempts.current;
        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            connect();
          }
        }, delay);
        setConnectionState("connecting");
      } else {
        setConnectionState("failed");
      }
    }
  }, [connectionState, fetchToken]);

  const sendAudio = useCallback((data: Blob) => {
    const client = deepgramClientRef.current;
    if (client && client.getReadyState() === 1) {
      client.send(data);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (deepgramClientRef.current) {
        deepgramClientRef.current.requestClose();
        deepgramClientRef.current = null;
      }
    };
  }, []);

  // Combine confirmed and interim transcript for display
  const displayTranscript =
    transcript + (interimTranscript ? ` ${interimTranscript}` : "");

  return {
    connect,
    disconnect,
    sendAudio,
    connectionState,
    transcript: displayTranscript.trim(),
    setTranscript,
    isListening,
    setIsListening,
  };
};
