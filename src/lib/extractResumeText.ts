import "server-only";
import mammoth from "mammoth";

export async function extractResumeText(filename: string, buffer: Buffer) {
  const lowerCaseFileName = filename.toLowerCase();
  console.log(`[extractResumeText] Processing file: ${filename}, buffer size: ${buffer.length}`);

  try {
    if (lowerCaseFileName.endsWith(".pdf")) {
      console.log("[extractResumeText] Detected PDF format");
      const { extractText } = await import("unpdf");
      const result = await extractText(new Uint8Array(buffer));
      console.log("[extractResumeText] unpdf result type:", typeof result);
      
      const text = typeof result === 'string' ? result : (result as any).text;
      const extractedText = (Array.isArray(text) ? text.join("\n") : text || "").trim();
      
      console.log("[extractResumeText] Extracted PDF text length:", extractedText.length);
      return extractedText;
    }
    
    if (lowerCaseFileName.endsWith(".docx")) {
      console.log("[extractResumeText] Detected DOCX format");
      const { value } = await mammoth.extractRawText({ buffer });
      console.log("[extractResumeText] Mammoth extracted text length:", value?.length ?? 0);
      return (value || "").trim();
    }
    
    if (lowerCaseFileName.endsWith(".txt")) {
      console.log("[extractResumeText] Detected TXT format");
      return buffer.toString("utf-8").trim();
    }

    throw new Error(`Unsupported resume format: ${filename}`);
  } catch (error) {
    console.error(`[extractResumeText] Error parsing file ${filename}:`, error);
    throw error;
  }
}
