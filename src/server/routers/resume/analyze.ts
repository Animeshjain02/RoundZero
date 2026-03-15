import { ORPCError } from "@orpc/client";
import { z } from "zod";

import { extractResumeText } from "@/lib/extractResumeText";
import { storageService } from "@/lib/storage";
import type { Context } from "@/server/orpc";
import { s3ResumeSchema } from "../interview/schemas";
import { analyzeResume, atsEvaluationSchema } from "@/lib/gemini";

export const analyzeResumeInput = z.object({
  resume: s3ResumeSchema,
});

export async function analyze({
  input,
  context,
}: {
  input: z.infer<typeof analyzeResumeInput>;
  context: Context;
}) {
  const { resume } = input;
  const { user } = context;

  if (!user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  if (!resume.key.startsWith(`resumes/${user.id}/`)) {
    throw new ORPCError("FORBIDDEN", {
      message: "You do not have access to this resume",
    });
  }

  // Download file from S3
  let buffer: Buffer;

  try {
    buffer = await storageService.download(resume.key);
  } catch (error) {
    console.error("[S3 Download Error]", error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to download resume from storage",
    });
  }

  // Extract text from resume
  let text: string;
  try {
    console.log("[Resume Analysis] Starting extraction for:", resume.filename);
    text = await extractResumeText(resume.filename, buffer);
    console.log("[Resume Analysis] Extraction successful, length:", text.length);
  } catch (error) {
    console.error("[Resume Text Extraction Error]", error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to extract resume text: " + (error instanceof Error ? error.message : String(error)),
    });
  }

  // Analyze text with AI
  try {
    const analysis = await analyzeResume(text);
    return analysis;
  } catch (error) {
    console.error("[Resume Analysis AI Error]", error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to analyze resume with AI",
    });
  }
}
