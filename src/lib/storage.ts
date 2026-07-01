import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "node:fs";
import path from "node:path";

const isR2Configured = !!(
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY
);

let s3Client: S3Client | null = null;
if (isR2Configured) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
  });
}

const BUCKET = process.env.R2_BUCKET_NAME || "notesos";

export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  if (isR2Configured && s3Client) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file,
        ContentType: contentType,
      })
    );

    if (process.env.R2_PUBLIC_URL) {
      return `${process.env.R2_PUBLIC_URL}/${key}`;
    }
    return key;
  } else {
    // Local filesystem fallback
    console.log("R2 credentials not configured. Using local filesystem fallback for upload.");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = path.basename(key);
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file);
    return `/uploads/${fileName}`;
  }
}

export async function deleteFile(key: string): Promise<void> {
  if (isR2Configured && s3Client) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );
  } else {
    console.log("R2 credentials not configured. Using local filesystem fallback for deletion.");
    const fileName = path.basename(key);
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export async function getSignedDownloadUrl(key: string): Promise<string> {
  if (isR2Configured && s3Client) {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } else {
    return key.startsWith("/") ? key : `/uploads/${path.basename(key)}`;
  }
}

export function generateFileKey(
  userId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `notes/${userId}/${timestamp}-${sanitized}`;
}
