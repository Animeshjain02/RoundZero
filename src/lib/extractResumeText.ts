import "server-only";
import mammoth from "mammoth";

const pdf = require("pdf-parse");

export async function extractResumeText(filename: string, buffer: Buffer) {
  const lowerCaseFileName = filename.toLowerCase();

  try {
    if (lowerCaseFileName.endsWith(".pdf")) {
      const data = await pdf(buffer);
      return (data.text || "").trim();
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
