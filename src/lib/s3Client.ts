import { S3Client } from "@aws-sdk/client-s3";
import { STORAGE_CONFIG } from "@/config/storage";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

export const S3 = new S3Client({
  region: STORAGE_CONFIG.region,
  endpoint: STORAGE_CONFIG.endpoint,
  forcePathStyle: false, // Tigris uses virtual-hosted style
  requestHandler: new NodeHttpHandler({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false, // Mismatch between IP and *.storage.dev cert
    }),
  }),
});
