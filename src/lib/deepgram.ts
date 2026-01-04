import { createClient } from '@deepgram/sdk';
import { env } from '@/config/env';

// Deepgram SDK client instance
export const deepgram = createClient(env.DEEPGRAM_API_KEY);

// Options for real-time speech-to-text
export interface STTOptions {
  model?: string;
  language?: string;
  smart_format?: boolean;
}

// Create a real-time STT connection
export const createSTTWebSocket = (options: STTOptions = {}) => {
  return deepgram.listen.live({
    model: options.model || 'nova-2',
    language: options.language || 'en-US',
    smart_format: options.smart_format ?? true,
  });
};

// Convert text to speech using Deepgram Aura
// Returns a Buffer containing the audio data
export const textToSpeech = async (
  text: string,
  voice: string = 'aura-asteria-en'
) => {
  const response = await deepgram.speak.request(
    { text },
    {
      model: voice,
      encoding: 'linear16',
      container: 'wav',
    }
  );

  const stream = await response.getStream();
  if (!stream) {
    throw new Error('Error generating TTS: No stream returned from Deepgram');
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
