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
      throw new Error("Failed to extract resume text");
    }

    return {
      message: "Resume text extracted successfully",
      resumeText,
    };
  }),

  parseResume: contract.parseResume.handler(async ({ input }) => {
    const { resume } = input;
    const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

    // decode base64 to Buffer
    let buffer: Buffer;
    try {
      buffer = Buffer.from(resume.base64, "base64");
    } catch (error) {
      throw new Error("Failed to decode base64");
    }

    if (buffer.length > MAX_FILE_BYTES) {
      throw new Error("File size should be less than 5 MB.");
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
    } = input;

    if (!user?.id) {
      throw new Error("Unauthorized");
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
      },
      select: {
        id: true,
      },
    });

    return { interviewId: interview.id };
  }),
};
