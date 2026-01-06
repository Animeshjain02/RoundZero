import "server-only";
import mammoth from "mammoth";
import { extractText } from "unpdf";

export async function extractResumeText(filename: string, buffer: Buffer) {
  const lowerCaseFileName = filename.toLowerCase();

  try {
    if (lowerCaseFileName.endsWith(".pdf")) {
      const { text } = await extractText(new Uint8Array(buffer));
      return (Array.isArray(text) ? text.join("\n") : text || "").trim();
    }
    if (lowerCaseFileName.endsWith(".docx")) {
      const { value } = await mammoth.extractRawText({ buffer });
      return (value || "").trim();
    }

    return buffer.toString("utf-8").trim();
  } catch (error) {
    console.error(`Error parsing file ${filename}:`, error);
    throw new Error("Failed to extract text from resume.");
  }
}
