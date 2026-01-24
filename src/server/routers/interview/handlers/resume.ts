import { ORPCError } from "@orpc/client";
import { extractResumeText } from "@/lib/extractResumeText";
import { storageService } from "@/lib/storage";
import { resumeContract } from "../contracts/resume";
import { interviewRepository } from "../interview.repository";
import {
  ALLOWED_RESUME_EXTENSIONS,
  FILE_LIMITS,
  isAllowedResumeExtension,
} from "../interview.schemas";

export const resumeHandlers = {
  // Parse resume from base64 encoded file
  postInterviewRole: resumeContract.postInterviewRole.handler(
    async ({ input }) => {
      const { resume } = input;

      // Validate file extension
      if (!isAllowedResumeExtension(resume.filename)) {
        throw new ORPCError("BAD_REQUEST", {
          message: `Unsupported file type. Allowed: ${ALLOWED_RESUME_EXTENSIONS.join(", ")}`,
        });
      }

      // Decode base64 content
      let buffer: Buffer;
      try {
        buffer = Buffer.from(resume.base64, "base64");
      } catch (error) {
        console.error("[Base64 Decode Error]", error);
        throw new ORPCError("BAD_REQUEST", {
          message: "Failed to decode file content",
        });
      }

      // Validate file size
      if (buffer.length > FILE_LIMITS.MAX_RESUME_SIZE_BYTES) {
        const maxSizeMB = FILE_LIMITS.MAX_RESUME_SIZE_BYTES / (1024 * 1024);
        throw new ORPCError("PAYLOAD_TOO_LARGE", {
          message: `File size should be less than ${maxSizeMB} MB`,
        });
      }

      // Extract text from resume
      let resumeText: string;
      try {
        resumeText = await extractResumeText(resume.filename, buffer);
      } catch (error) {
        console.error("[Resume Text Extraction Error]", error);
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message:
            "Failed to extract resume text. Please try a different file format.",
        });
      }

      return {
        message: "Resume text extracted successfully",
        resumeText,
      };
    },
  ),

  // Parse resume from S3 storage
  parseResume: resumeContract.parseResume.handler(async ({ input }) => {
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
  }),

  // List user's resumes
  listResumes: resumeContract.listResumes.handler(async ({ context }) => {
    const { user } = context;

    const resumes = await interviewRepository.getResumesByUserId(user.id);

    return resumes;
  }),
};
