import { ORPCError } from "@orpc/client";
import { z } from "zod";

import { extractResumeText } from "@/lib/extractResumeText";
import { storageService } from "@/lib/storage";
import { s3ResumeSchema } from "../interview/schemas";

export const parseResumeInput = z.object({
  resume: s3ResumeSchema,
});

export async function parseResume({
  input,
}: {
  input: z.infer<typeof parseResumeInput>;
}) {
  const { resume } = input;

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
    text = await extractResumeText(resume.filename, buffer);
  } catch (error) {
    console.error("[Resume Text Extraction Error]", error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to extract resume text",
    });
  }

  return { text };
}
