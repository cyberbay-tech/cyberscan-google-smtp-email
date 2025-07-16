// Node.js types
import { Buffer } from 'buffer';

// Email configuration types
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
  fromAlias?: string;
  fromEmail?: string;
}

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: Buffer;
  contentType: string;
}

// File attachment types
export interface AttachmentConfig {
  source: 'local' | 'google-drive' | 'aws-s3' | 'upload' | 'url' | 'buffer';
  path?: string;
  name?: string;
  type?: string;
  content?: Buffer;
  url?: string;
}

export interface FileInfo {
  size: number;
  sizeMB: string;
  mimeType: string;
  name: string;
  path: string;
  exists: boolean;
  error?: string;
}

export interface ProcessedAttachment {
  success: boolean;
  source: string;
  type: 'attachment' | 'link';
  data: {
    filename?: string;
    path?: string;
    contentType?: string;
    content?: Buffer;
    url?: string;
    fileId?: string;
    size?: number;
    s3Key?: string;
    bucket?: string;
  };
  info?:
    | FileInfo
    | {
        size: number;
        sizeMB: string;
        uploadTime: number;
      };
  error?: string;
  originalPath?: string;
}

export interface EmailFormat {
  attachments: EmailAttachment[];
  driveLinks: DriveLink[];
  s3Links: S3Link[];
  urlLinks: UrlLink[];
  hasLargeFiles: boolean;
}

export interface DriveLink {
  fileName: string;
  link: string;
  size?: number;
}

export interface S3Link {
  fileName: string;
  link: string;
}

export interface UrlLink {
  fileName: string;
  link: string;
}

// Google Drive types
export interface GoogleDriveUploadResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  viewLink: string;
  downloadLink: string;
  uploadTime: number;
}

// AWS S3 types
export interface S3UploadResult {
  Location: string;
  Bucket: string;
  Key: string;
  ETag: string;
}

// Uploaded file types
export interface UploadedFile {
  buffer?: Buffer;
  data?: Buffer;
  originalname?: string;
  name?: string;
  mimetype?: string;
  type?: string;
}

// Email sending result types
export interface EmailSendingResult {
  messageId?: string;
  response?: string;
  accepted?: string[];
  rejected?: string[];
  pending?: string[];
  envelope?: {
    from?: string;
    to?: string[];
  };
}

export interface EmailResult {
  success: boolean;
  emailResult?: EmailSendingResult;
  attachmentsProcessed?: number;
  error?: string;
}

// Large file sending options
export interface LargeFileOptions {
  to: string;
  subject: string;
  message: string;
  filePaths: string[];
  folderId?: string;
  sendEmail?: boolean;
}

export interface LargeFileResult {
  success: boolean;
  uploadResults?: ProcessedAttachment[];
  successfulUploads?: ProcessedAttachment[];
  failedUploads?: ProcessedAttachment[];
  error?: string;
}
