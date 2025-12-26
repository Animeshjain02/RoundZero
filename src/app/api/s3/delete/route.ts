import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { S3 } from "@/lib/s3Client";

export async function DELETE(req: Request) {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
