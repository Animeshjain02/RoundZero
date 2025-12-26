import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { S3 } from "@/lib/s3Client";

const uploadRequestSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  size: z.number(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = uploadRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }

    const { fileName, contentType, size } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const preSignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, // 6 minutes
    });

    const response = {
      preSignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid Server Error" },
      { status: 500 },
    );
  }
}
