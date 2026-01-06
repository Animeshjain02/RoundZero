import { sttContract } from "./stt";
import { ttsContract } from "./tts";
import { uploadContract } from "./upload";

export const contract = {
  ...sttContract,
  ...ttsContract,
  ...uploadContract,
};
