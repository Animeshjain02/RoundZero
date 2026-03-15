import { z } from "zod";
import { ORPCError } from "@orpc/client";
import { storageService } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export const directUploadInput = z.object({
  file: z.instanceof(Blob),
  filename: z.string(),
  contentType: z.enum([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]),
});

export const directUpload = async ({
  input,
  context,
}: {
  input: z.infer<typeof directUploadInput>;
  context: { user: { id: string } };
}) => {
  const { user } = context;
  if (!user) throw new ORPCError("UNAUTHORIZED");

  try {
    const buffer = Buffer.from(await input.file.arrayBuffer());
    const path = "resumes";
    const filename = `${user.id}/${uuidv4()}-${input.filename.replace(/\s+/g, "_")}`;
    
    const result = await storageService.upload(buffer, path, filename, {
      contentType: input.contentType,
      metadata: {
        userId: user.id,
        originalName: input.filename,
      },
    });

    return {
      key: result.key,
      url: result.url,
    };
  } catch (error: any) {
    console.error("[DirectUpload] Full Error:", error);
    if (error.stack) console.error(error.stack);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: `Upload failed: ${error.message || "Unknown error"}`,
    });
  }
};
