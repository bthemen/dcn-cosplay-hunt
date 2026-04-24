import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * --- CONFIGURATION & ENVIRONMENT VALIDATION ---
 * Validating environment variables at the top-level ensures that the application
 * fails immediately if misconfigured, rather than crashing during a runtime execution.
 */
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET_NAME) {
  throw new Error("CRITICAL: Missing required AWS S3 environment variables. Check .env configuration.");
}

/**
 * @field s3Client
 * The singleton instance of the S3Client used for all storage operations.
 * Initialized with credentials retrieved from environment variables.
 */
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * @method uploadToS3
 * Uploads a binary file (Buffer) to the configured S3 bucket.
 * * @param {Buffer} file - The raw binary data of the file to be uploaded.
 * @param {string} fileName - The unique identifier/path (key) for the file in the bucket.
 * * @returns {Promise<string>} - Returns the public access URL of the uploaded object.
 * * @throws {Error} - Throws a specific error if the S3 service returns a failure status 
 * or if the network request times out.
 */
export async function uploadToS3(file: Buffer, fileName: string): Promise<string> {
  // Defensive check for input parameters
  if (!file || file.length === 0) {
    throw new Error("Invalid input: File buffer is empty or undefined.");
  }
  if (!fileName || fileName.trim() === "") {
    throw new Error("Invalid input: Filename must be a non-empty string.");
  }

  // Construct the command object
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: "image/jpeg",
  });

  try {
    // Attempt the upload operation
    await s3Client.send(command);
    
    // Construct and return the URL
    // Note: This assumes the bucket is public or the URL structure is consistent
    return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    
  } catch (err: unknown) {
    // Explicitly catching the error to prevent application crash and provide diagnostic info
    // We cast err to 'any' or check 'instanceof Error' to safely access the message
    const errorMessage = err instanceof Error ? err.message : "Unknown S3 upload error";
    
    console.error(`[S3 Upload Failure] Key: ${fileName} | Error: ${errorMessage}`);
    
    // Throw an explicit error to be handled by the calling API route/service
    throw new Error(`S3_UPLOAD_FAILED: ${errorMessage}`);
  }
}