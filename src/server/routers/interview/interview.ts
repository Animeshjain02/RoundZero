import { extractResumeText } from "@/lib/extractResumeText";
import { contract } from "./interview.contract";

const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

export const interviewRouter = {
  postInterviewRole: contract.postInterviewRole.handler(async ({ input }) => {
    const { jobRole, skills = [], resume } = input;

    const lowerResumeFileName = resume.filename.toLowerCase();

    if (!/\.(pdf|docx|doc|txt)$/i.test(lowerResumeFileName)) {
      throw new Error(
        "Unsupported file type. Allowed: .pdf, .docx, .doc, .txt",
      );
    }

    // decode base64 to Buffer
    let buffer: Buffer;

    try {
      buffer = Buffer.from(resume.base64, "base64");
    } catch (error) {
      console.error("Base64 Decode Error:", error);
      throw new Error("Failed to decode base64");
    }

    // check file size
    if (buffer.length > MAX_FILE_BYTES) {
      throw new Error("File size should be less than 2 MB.");
    }

    // extract text
    let resumeText = "";
    try {
      resumeText = await extractResumeText(resume.filename, buffer);
    } catch (error) {
      console.error("Resume Text Extraction Error:", error);
      throw new Error("Failed to extract resume text");
    }

    return {
      message: "Resume text extracted successfully",
      resumeText,
    };
  }),

  parseResume: contract.parseResume.handler(async ({ input }) => {
    const { resume } = input;
    const { S3 } = await import("@/lib/s3Client");
    const { GetObjectCommand } = await import("@aws-sdk/client-s3");
    // const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

    // Fetch file from S3
    let buffer: Buffer;
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: resume.key,
      });

      const response = await S3.send(command);

      if (!response.Body) {
        throw new Error("Failed to download file from S3");
      }

      // stream to buffer
      const byteArray = await response.Body.transformToByteArray();
      buffer = Buffer.from(byteArray);
    } catch (error) {
      console.error("S3 Download Error:", error);
      throw new Error("Failed to download resume from storage");
    }

    const text = await extractResumeText(resume.filename, buffer);
    return { text };
  }),

  create: contract.create.handler(async ({ input, context }) => {
    const { user } = context;
    const { default: db } = await import("@/lib/prisma");
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

    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    let resumeId: string | undefined;

    if (resumeKey && resumeFilename) {
      try {
        const createdResume = await db.resume.create({
          data: {
            userId: user.id,
            title: resumeFilename,
            content: resumeText,
            fileUrl: `https://${process.env.S3_BUCKET_NAME}.t3.storage.dev/${resumeKey}`, // Construct URL or store key
          },
        });
        resumeId = createdResume.id;
      } catch (error) {
        console.error("Failed to create resume record:", error);
      }
    }

    const interview = await db.interview.create({
      data: {
        userId: user.id,
        jobTitle,
        resumeText,
        type,
        techStack,
        experienceLevel,
        includeDSA,
        status: "SETUP",
        resumeId: resumeId,
      },
      select: {
        id: true,
      },
    });

    return { interviewId: interview.id };
  }),
};
