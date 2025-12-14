import mammoth from "mammoth";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require("pdf-parse");

export async function extractResumeText(filename: string, buffer: Buffer) {
  const lowerCaseFileName = filename.toLowerCase();

  if (lowerCaseFileName.endsWith(".pdf")) {
    const dataBuffer = Buffer.from(buffer);
    const data = await pdf(dataBuffer);
    return (data.text || "").trim();
  }

  if (lowerCaseFileName.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return (value || "").trim();
  }

  return buffer.toString("utf-8").trim();
}
