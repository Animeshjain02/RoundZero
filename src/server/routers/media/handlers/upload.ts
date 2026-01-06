import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ORPCError } from "@orpc/client";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/config/env";
import { STORAGE_CONFIG } from "@/config/storage";
import { S3 } from "@/lib/s3Client";
import { uploadContract } from "../contracts/upload";

// Valid content types by purpose
const VALID_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const VALID_AUDIO_TYPES = [
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/ogg",
  "audio/webm",
];

// MIME type to extension mapping
const MIME_TO_EXT: Record<string, string> = {
  "audio/wav": "wav",
  "audio/wave": "wav",
  "audio/x-wav": "wav",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
};

/**
 * Sanitize filename to prevent path traversal
 */
const sanitizeFilename = (filename: string): string => {
  const basename = filename.split(/[/\\]/).pop() || "";
  const sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return sanitized.slice(0, 100) || "file";
};

export const uploadHandlers = {
  getPresignedUrl: uploadContract.getPresignedUrl.handler(
    async ({ input, context }) => {
      const { user } = context;
      if (!user) throw new ORPCError("UNAUTHORIZED");

      const { filename, contentType, purpose, interviewId } = input;

      // Validate content type based on purpose
      if (purpose === "resume" && !VALID_RESUME_TYPES.includes(contentType)) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Invalid content type for resume upload",
        });
      }

      if (
        purpose === "interview_audio" &&
        !VALID_AUDIO_TYPES.includes(contentType)
      ) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Invalid content type for audio upload",
        });
      }

      const sanitizedFilename = sanitizeFilename(filename);

      let key = "";
      if (purpose === "resume") {
        key = `resumes/${user.id}/${uuidv4()}-${sanitizedFilename}`;
      } else if (purpose === "interview_audio") {
        if (!interviewId) {
          throw new ORPCError("BAD_REQUEST", {
            message: "Interview ID required for audio upload",
          });
        }
        const ext = MIME_TO_EXT[contentType] || "wav";
        key = `interviews/${interviewId}/audio/${uuidv4()}.${ext}`;
      } else {
        throw new ORPCError("BAD_REQUEST", {
          message: "Invalid upload purpose",
        });
      }

      try {
        const command = new PutObjectCommand({
          Bucket: STORAGE_CONFIG.bucketName,
          Key: key,
          ContentType: contentType,
        });

        // URL expires in 5 minutes
        const url = await getSignedUrl(S3, command, { expiresIn: 300 });

        return { url, key };
      } catch (error) {
        console.error("[Presigned URL Error]", error);
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to generate upload URL",
        });
      }
    },
  ),
};
