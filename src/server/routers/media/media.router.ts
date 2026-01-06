import { sttHandlers } from "./handlers/stt";
import { ttsHandlers } from "./handlers/tts";
import { uploadHandlers } from "./handlers/upload";

export const mediaRouter = {
  ...sttHandlers,
  ...ttsHandlers,
  ...uploadHandlers,
};
