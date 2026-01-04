import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { STORAGE_CONFIG } from "@/config/storage";
import { S3 } from "./s3Client";

// Storage path prefixes
export const STORAGE_PATHS = {
  INTERVIEWS: "interviews",
  RESUMES: "resumes",
  AUDIO: "audio",
} as const;

export type StoragePath = (typeof STORAGE_PATHS)[keyof typeof STORAGE_PATHS];

// Content types
export const CONTENT_TYPES = {
  WAV: "audio/wav",
  WEBM: "audio/webm",
  PDF: "application/pdf",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;

export interface UploadOptions {
  contentType: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
}

// Storage service for S3 operations
export const storageService = {
  // Upload a buffer to S3 and return the public URL
  async upload(
    buffer: Buffer,
    path: string,
    filename: string,
    options: UploadOptions,
  ): Promise<UploadResult> {
    const key = `${path}/${filename}`;

    await S3.send(
      new PutObjectCommand({
        Bucket: STORAGE_CONFIG.bucketName,
        Key: key,
        Body: buffer,
        ContentType: options.contentType,
        Metadata: options.metadata,
      }),
    );

    return {
      key,
      url: STORAGE_CONFIG.getPublicUrl(key),
    };
  },

  // Upload audio file with auto-generated filename
  async uploadAudio(
    buffer: Buffer,
    interviewId: string,
    contentType: string = CONTENT_TYPES.WAV,
  ): Promise<string> {
    const filename = `${uuidv4()}.wav`;
    const path = `${STORAGE_PATHS.INTERVIEWS}/${interviewId}/${STORAGE_PATHS.AUDIO}`;

    const result = await this.upload(buffer, path, filename, { contentType });
    return result.url;
  },

  // Download a file from S3
  async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: STORAGE_CONFIG.bucketName,
      Key: key,
    });

    const response = await S3.send(command);

    if (!response.Body) {
      throw new Error("Failed to download file from S3: No body returned");
    }

    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  },

  // Generate a presigned URL for client-side upload
  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: STORAGE_CONFIG.bucketName,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(S3, command, { expiresIn });
  },

  // Generate a presigned URL for downloading
  async getPresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: STORAGE_CONFIG.bucketName,
      Key: key,
    });

    return getSignedUrl(S3, command, { expiresIn });
  },

  // Build a public URL for a given key
  getPublicUrl(key: string): string {
    return STORAGE_CONFIG.getPublicUrl(key);
  },
};
