import 'server-only';

import { env } from './env';

// Type-safe storage constants - server-only
export const STORAGE_CONFIG = {
  bucketName: env.S3_BUCKET_NAME,
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  getPublicUrl: (key: string) => {
    const endpointUrl = new URL(env.S3_ENDPOINT);
    if (endpointUrl.hostname.includes('t3.storage.dev')) {
      return `https://${env.S3_BUCKET_NAME}.t3.storage.dev/${key}`;
    }
    return `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${key}`;
  },
} as const;
