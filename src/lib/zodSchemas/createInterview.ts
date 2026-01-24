import { z } from "zod";

export const createInterviewSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters long"),
  resumeText: z
    .string()
    .min(10, "Resume content must be at least 10 characters long"),
  includeDSA: z.boolean().default(false),
  type: z
    .enum(["TECHNICAL", "BEHAVIORAL", "SYSTEM_DESIGN"])
    .default("TECHNICAL"),
  experienceLevel: z.enum(["junior", "mid", "senior"]).default("mid"),
  techStack: z.string().optional(),
  resumeId: z.string().optional(),
});

export type CreateInterviewSchemaType = z.infer<typeof createInterviewSchema>;
