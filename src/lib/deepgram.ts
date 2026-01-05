import { createClient, type LiveSchema } from "@deepgram/sdk";
import { env } from "@/config/env";

// Deepgram SDK client instance (singleton)
export const deepgram = createClient(env.DEEPGRAM_API_KEY);

// Voice options for TTS
export const TTS_VOICES = {
  ASTERIA: "aura-asteria-en",
  LUNA: "aura-luna-en",
  STELLA: "aura-stella-en",
  ATHENA: "aura-athena-en",
  HERA: "aura-hera-en",
  ORION: "aura-orion-en",
  ARCAS: "aura-arcas-en",
  PERSEUS: "aura-perseus-en",
  ANGUS: "aura-angus-en",
  ORPHEUS: "aura-orpheus-en",
  HELIOS: "aura-helios-en",
  ZEUS: "aura-zeus-en",
} as const;

export type TTSVoice = (typeof TTS_VOICES)[keyof typeof TTS_VOICES];

// STT configuration options
export interface STTOptions {
  model?: "nova-2" | "nova-2-general" | "nova-2-meeting" | "nova-2-phonecall";
  language?: string;
  smartFormat?: boolean;
  interimResults?: boolean;
  utteranceEndMs?: number;
  vadEvents?: boolean;
}

// Default STT configuration
const DEFAULT_STT_OPTIONS: Required<STTOptions> = {
  model: "nova-2",
  language: "en-US",
  smartFormat: true,
  interimResults: true,
  utteranceEndMs: 1000,
  vadEvents: true,
};

// TTS configuration
export interface TTSOptions {
  voice?: TTSVoice;
  encoding?: "linear16" | "mp3" | "opus" | "flac" | "alaw" | "mulaw";
  container?: "wav" | "mp3" | "ogg" | "none";
}

const DEFAULT_TTS_OPTIONS: Required<TTSOptions> = {
  voice: TTS_VOICES.ASTERIA,
  encoding: "linear16",
  container: "wav",
};

// Create a real-time STT WebSocket connection
export const createSTTWebSocket = (options: STTOptions = {}) => {
  const config: LiveSchema = {
    model: options.model ?? DEFAULT_STT_OPTIONS.model,
    language: options.language ?? DEFAULT_STT_OPTIONS.language,
    smart_format: options.smartFormat ?? DEFAULT_STT_OPTIONS.smartFormat,
    interim_results:
      options.interimResults ?? DEFAULT_STT_OPTIONS.interimResults,
    utterance_end_ms:
      options.utteranceEndMs ?? DEFAULT_STT_OPTIONS.utteranceEndMs,
    vad_events: options.vadEvents ?? DEFAULT_STT_OPTIONS.vadEvents,
  };

  return deepgram.listen.live(config);
};

// Convert text to speech using Deepgram aura return buffer containing audio data
export const textToSpeech = async (
  text: string,
  options: TTSOptions = {},
): Promise<Buffer> => {
  const voice = options.voice ?? DEFAULT_TTS_OPTIONS.voice;
  const encoding = options.encoding ?? DEFAULT_TTS_OPTIONS.encoding;
  const container = options.container ?? DEFAULT_TTS_OPTIONS.container;

  const response = await deepgram.speak.request(
    { text },
    {
      model: voice,
      encoding,
      container,
    },
  );

  const stream = await response.getStream();
  if (!stream) {
    throw new Error("TTS generation failed: No stream returned from Deepgram");
  }

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
};

// Create a temporary API key for client-side STT
export const createTemporaryApiKey = async (
  ttlSeconds: number = 600,
): Promise<string> => {
  const { result } = await deepgram.manage.createProjectKey(
    env.DEEPGRAM_PROJECT_ID,
    {
      comment: "Temporary key for client STT",
      scopes: ["usage:write"],
      time_to_live_in_seconds: ttlSeconds,
    },
  );

  if (!result?.key) {
    throw new Error("Failed to create temporary Deepgram API key");
  }

  return result.key;
};
