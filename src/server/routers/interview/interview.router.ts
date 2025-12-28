import { ORPCError } from "@orpc/client";
import { extractResumeText } from "@/lib/extractResumeText";
import { contract } from "./interview.contract";
import { interviewRepository } from "./interview.repository";

const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

export const interviewRouter = {
  // Parse resume from base64
  postInterviewRole: contract.postInterviewRole.handler(async ({ input }) => {
    const { resume } = input;
    const lowerResumeFileName = resume.filename.toLowerCase();

    if (!/\.(pdf|docx|doc|txt)$/i.test(lowerResumeFileName)) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Unsupported file type. Allowed: .pdf, .docx, .doc, .txt",
      });
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(resume.base64, "base64");
    } catch (error) {
      console.error("Base64 Decode Error:", error);
      throw new ORPCError("BAD_REQUEST", {
        message: "Failed to decode base64",
      });
    }

    if (buffer.length > MAX_FILE_BYTES) {
      throw new ORPCError("PAYLOAD_TOO_LARGE", {
        message: "File size should be less than 2 MB.",
      });
    }

    let resumeText = "";
    try {
      resumeText = await extractResumeText(resume.filename, buffer);
    } catch (error) {
      console.error("Resume Text Extraction Error:", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to extract resume text",
      });
    }

    return {
      message: "Resume text extracted successfully",
      resumeText,
    };
  }),

  // Parse resume from S3
  parseResume: contract.parseResume.handler(async ({ input }) => {
    const { resume } = input;
    const { S3 } = await import("@/lib/s3Client");
    const { GetObjectCommand } = await import("@aws-sdk/client-s3");

    let buffer: Buffer;
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: resume.key,
      });

      const response = await S3.send(command);

      if (!response.Body) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to download file from S3",
        });
      }

      const byteArray = await response.Body.transformToByteArray();
      buffer = Buffer.from(byteArray);
    } catch (error) {
      console.error("S3 Download Error:", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to download resume from storage",
      });
    }

    const text = await extractResumeText(resume.filename, buffer);
    return { text };
  }),

  // Create interview
  create: contract.create.handler(async ({ input, context }) => {
    const { user } = context;

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const {
      jobTitle,
      resumeText,
      type,
      includeDSA,
      techStack,
      experienceLevel,
      resumeKey,
      resumeFilename,
    } = input;

    let resumeId: string | undefined;

    // Create resume record if file was uploaded
    if (resumeKey && resumeFilename) {
      try {
        const createdResume = await interviewRepository.createResume({
          userId: user.id,
          title: resumeFilename,
          content: resumeText,
          fileUrl: `https://${process.env.S3_BUCKET_NAME}.t3.storage.dev/${resumeKey}`,
        });
        resumeId = createdResume.id;
      } catch (error) {
        console.error("Failed to create resume record:", error);
      }
    }

    const interview = await interviewRepository.createInterview({
      userId: user.id,
      jobTitle,
      resumeText,
      type,
      techStack,
      experienceLevel,
      includeDSA,
      resumeId,
    });

    return { interviewId: interview.id };
  }),

  // List user's interviews
  list: contract.list.handler(async ({ input, context }) => {
    const { user } = context;

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const { limit, offset, status } = input;

    const [interviews, total] = await Promise.all([
      interviewRepository.getByUserId({
        userId: user.id,
        limit,
        offset,
        status,
      }),
      interviewRepository.countByUserId(user.id, status),
    ]);

    return {
      interviews: interviews.map((i) => ({
        id: i.id,
        jobTitle: i.jobTitle,
        type: i.type,
        status: i.status,
        startedAt: i.startedAt,
        endedAt: i.endedAt,
        durationSec: i.durationSec,
        score: i.report?.overallScore ?? null,
      })),
      total,
    };
  }),

  // Get interview by ID
  getById: contract.getById.handler(async ({ input, context }) => {
    const { user } = context;

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const interview = await interviewRepository.getById(input.id, user.id);

    if (!interview) {
      return { interview: null };
    }

    return {
      interview: {
        id: interview.id,
        jobTitle: interview.jobTitle,
        type: interview.type,
        status: interview.status,
        startedAt: interview.startedAt,
        endedAt: interview.endedAt,
        durationSec: interview.durationSec,
        resumeText: interview.resumeText,
        techStack: interview.techStack,
        experienceLevel: interview.experienceLevel,
        includeDSA: interview.includeDSA,
      },
    };
  }),

  // Get user stats
  stats: contract.stats.handler(async ({ context }) => {
    const { user } = context;

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return interviewRepository.getUserStats(user.id);
  }),

  // Delete interview
  delete: contract.delete.handler(async ({ input, context }) => {
    const { user } = context;

    if (!user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    const result = await interviewRepository.delete(input.id, user.id);

    return { success: result.count > 0 };
  }),
};
