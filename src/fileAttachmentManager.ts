import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import uploadToDriveServiceAccount from './uploadToDriveServiceAccount';
import {
  AttachmentConfig,
  FileInfo,
  ProcessedAttachment,
  EmailFormat,
  DriveLink,
  S3Link,
  UrlLink,
} from './types';
import config from './config';

/**
 * File Attachment Manager - Supports multiple file sources
 */
class FileAttachmentManager {
  private s3: S3Client | null = null;

  constructor() {
    this.initializeS3();
  }

  /**
   * Initialize AWS S3 client
   */
  private initializeS3(): void {
    if (config.aws.accessKeyId && config.aws.secretAccessKey) {
      this.s3 = new S3Client({
        region: config.aws.region,
        credentials: {
          accessKeyId: config.aws.accessKeyId,
          secretAccessKey: config.aws.secretAccessKey,
        },
      });
    }
  }

  /**
   * Get file info (size, mime type, etc.)
   * @param filePath - Path to the file
   * @returns File information
   */
  getFileInfo(filePath: string): FileInfo {
    try {
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        sizeMB: (stats.size / 1024 / 1024).toFixed(2),
        mimeType: mime.lookup(filePath) || 'application/octet-stream',
        name: path.basename(filePath),
        path: filePath,
        exists: true,
      };
    } catch (error) {
      return {
        size: 0,
        sizeMB: '0',
        mimeType: 'application/octet-stream',
        name: path.basename(filePath),
        path: filePath,
        exists: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Process file attachment based on source type
   * @param attachment - Attachment configuration
   * @returns Processed attachment result
   */
  async processAttachment(
    attachment: AttachmentConfig
  ): Promise<ProcessedAttachment> {
    const { source, path: filePath, name, type, content, url } = attachment;

    try {
      switch (source) {
        case 'local':
          return await this.processLocalFile(filePath!, name);
        case 'google-drive':
          return await this.processGoogleDriveFile(filePath!, name);
        case 'aws-s3':
          return await this.processS3File(filePath!, name);
        case 'upload':
          return await this.processUploadedFile(content!, name!, type!);
        case 'url':
          return await this.processUrlFile(url!, name);
        case 'buffer':
          return await this.processBufferFile(content!, name!, type!);
        default:
          throw new Error(`Unsupported attachment source: ${source}`);
      }
    } catch (error) {
      const result: ProcessedAttachment = {
        success: false,
        error: (error as Error).message,
        source,
        type: 'attachment',
        data: {},
      };
      if (filePath) result.originalPath = filePath;
      return result;
    }
  }

  /**
   * Process local file attachment
   * @param filePath - Path to local file
   * @param name - Custom file name (optional)
   * @returns Attachment result
   */
  private async processLocalFile(
    filePath: string,
    name?: string
  ): Promise<ProcessedAttachment> {
    console.log(`📁 Processing local file: ${filePath}`);

    const fileInfo = this.getFileInfo(filePath);
    if (!fileInfo.exists) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Check file size for email attachment limit
    const maxEmailSize = 25 * 1024 * 1024; // 25MB
    if (fileInfo.size > maxEmailSize) {
      console.log(
        `⚠️ File too large for email (${fileInfo.sizeMB} MB), uploading to Google Drive...`
      );
      return await this.processGoogleDriveFile(filePath, name);
    }

    return {
      success: true,
      source: 'local',
      type: 'attachment',
      data: {
        filename: name || fileInfo.name,
        path: filePath,
        contentType: fileInfo.mimeType,
      },
      info: fileInfo,
    };
  }

  /**
   * Process Google Drive file attachment
   * @param filePath - Path to local file
   * @param name - Custom file name (optional)
   * @returns Attachment result
   */
  private async processGoogleDriveFile(
    filePath: string,
    name?: string
  ): Promise<ProcessedAttachment> {
    console.log(`☁️ Processing Google Drive file: ${filePath}`);

    try {
      const uploadResult = await uploadToDriveServiceAccount.uploadFileToDrive(
        filePath,
        name
      );
      const publicLink = await uploadToDriveServiceAccount.makeFilePublic(
        uploadResult.fileId
      );

      return {
        success: true,
        source: 'google-drive',
        type: 'link',
        data: {
          filename: uploadResult.fileName,
          url: publicLink,
          fileId: uploadResult.fileId,
          size: uploadResult.fileSize,
        },
        info: {
          size: uploadResult.fileSize,
          sizeMB: (uploadResult.fileSize / 1024 / 1024).toFixed(2),
          uploadTime: uploadResult.uploadTime,
        },
      };
    } catch (error) {
      throw new Error(
        `Google Drive upload failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Process AWS S3 file attachment
   * @param filePath - Path to local file or S3 key
   * @param name - Custom file name (optional)
   * @returns Attachment result
   */
  private async processS3File(
    filePath: string,
    name?: string
  ): Promise<ProcessedAttachment> {
    console.log(`☁️ Processing S3 file: ${filePath}`);

    if (!this.s3) {
      throw new Error(
        'AWS S3 not configured. Please set AWS credentials in .env file.'
      );
    }

    try {
      // If filePath is a local file, upload to S3 first
      if (fs.existsSync(filePath)) {
        const fileInfo = this.getFileInfo(filePath);
        const s3Key = `email-attachments/${Date.now()}-${fileInfo.name}`;

        const uploadParams: PutObjectCommandInput = {
          Bucket: config.aws.s3Bucket,
          Key: s3Key,
          Body: fs.createReadStream(filePath),
          ContentType: fileInfo.mimeType,
          ACL: 'public-read',
        };

        await this.s3.send(new PutObjectCommand(uploadParams));

        const location = config.aws.s3BucketUrl
          ? `${config.aws.s3BucketUrl}/${s3Key}`
          : `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${s3Key}`;

        return {
          success: true,
          source: 'aws-s3',
          type: 'link',
          data: {
            filename: name || fileInfo.name,
            url: location,
            s3Key: s3Key,
            ...(config.aws.s3Bucket ? { bucket: config.aws.s3Bucket } : {}),
          },
          info: fileInfo,
        };
      } else {
        // Assume filePath is an S3 key
        const s3Key = filePath;
        const url = config.aws.s3BucketUrl
          ? `${config.aws.s3BucketUrl}/${s3Key}`
          : `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${s3Key}`;

        return {
          success: true,
          source: 'aws-s3',
          type: 'link',
          data: {
            filename: name || path.basename(s3Key),
            url: url,
            s3Key: s3Key,
          },
        };
      }
    } catch (error) {
      throw new Error(`S3 processing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Process uploaded file (from form data)
   * @param content - File content buffer
   * @param name - File name
   * @param type - MIME type
   * @returns Attachment result
   */
  private async processUploadedFile(
    content: Buffer,
    name: string,
    type: string
  ): Promise<ProcessedAttachment> {
    console.log(`📤 Processing uploaded file: ${name}`);

    const maxEmailSize = 25 * 1024 * 1024; // 25MB
    const fileSize = content.length;

    if (fileSize > maxEmailSize) {
      console.log(
        `⚠️ Uploaded file too large (${(fileSize / 1024 / 1024).toFixed(
          2
        )} MB), saving to temp and uploading to Google Drive...`
      );

      // Save to temp file and upload to Google Drive
      const tempPath = path.join(
        __dirname,
        '..',
        'temp',
        `${Date.now()}-${name}`
      );
      fs.mkdirSync(path.dirname(tempPath), { recursive: true });
      fs.writeFileSync(tempPath, content);

      try {
        const result = await this.processGoogleDriveFile(tempPath, name);
        // Clean up temp file
        fs.unlinkSync(tempPath);
        return result;
      } catch (error) {
        // Clean up temp file on error
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        throw error;
      }
    }

    return {
      success: true,
      source: 'upload',
      type: 'attachment',
      data: {
        filename: name,
        content: content,
        contentType: type,
      },
      info: {
        size: fileSize,
        sizeMB: (fileSize / 1024 / 1024).toFixed(2),
        uploadTime: 0,
      },
    };
  }

  /**
   * Process URL file attachment
   * @param url - File URL
   * @param name - Custom file name (optional)
   * @returns Attachment result
   */
  private async processUrlFile(
    url: string,
    name?: string
  ): Promise<ProcessedAttachment> {
    console.log(`🌐 Processing URL file: ${url}`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch file from URL: ${response.statusText}`
        );
      }

      const content = await response.arrayBuffer();
      const buffer = Buffer.from(content);
      const contentType =
        response.headers.get('content-type') || 'application/octet-stream';
      const fileName = name || path.basename(url) || 'downloaded-file';

      return await this.processUploadedFile(buffer, fileName, contentType);
    } catch (error) {
      throw new Error(`URL processing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Process buffer file attachment
   * @param content - File content buffer
   * @param name - File name
   * @param type - MIME type
   * @returns Attachment result
   */
  private async processBufferFile(
    content: Buffer,
    name: string,
    type: string
  ): Promise<ProcessedAttachment> {
    console.log(`💾 Processing buffer file: ${name}`);

    return await this.processUploadedFile(content, name, type);
  }

  /**
   * Process multiple attachments
   * @param attachments - Array of attachment configurations
   * @returns Array of processed attachments
   */
  async processAttachments(
    attachments: AttachmentConfig[]
  ): Promise<ProcessedAttachment[]> {
    console.log(`📎 Processing ${attachments.length} attachments...`);

    const results: ProcessedAttachment[] = [];

    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i];
      if (!attachment) continue;
      console.log(
        `\n📎 Processing attachment ${i + 1}/${attachments.length}: ${
          attachment.name || attachment.path
        }`
      );

      try {
        const result = await this.processAttachment(attachment);
        results.push(result);
        console.log(`✅ Attachment ${i + 1} processed successfully`);
      } catch (error) {
        const failResult: ProcessedAttachment = {
          success: false,
          error: (error as Error).message,
          source: attachment.source,
          type: 'attachment',
          data: {},
        };
        if (attachment.path) failResult.originalPath = attachment.path;
        results.push(failResult);
      }
    }

    return results;
  }

  /**
   * Convert processed attachments to email format
   * @param processedAttachments - Array of processed attachments
   * @returns Email attachments and links
   */
  convertToEmailFormat(
    processedAttachments: ProcessedAttachment[]
  ): EmailFormat {
    const emailAttachments: Array<{
      filename: string;
      path?: string;
      content?: Buffer;
      contentType: string;
    }> = [];
    const driveLinks: DriveLink[] = [];
    const s3Links: S3Link[] = [];
    const urlLinks: UrlLink[] = [];

    processedAttachments.forEach(attachment => {
      if (!attachment || !attachment.success) {
        if (attachment && attachment.error) {
          console.warn(`⚠️ Skipping failed attachment: ${attachment.error}`);
        }
        return;
      }

      switch (attachment.type) {
        case 'attachment':
          if (attachment.data.filename && attachment.data.contentType) {
            const att: {
              filename: string;
              contentType: string;
              path?: string;
              content?: Buffer;
            } = {
              filename: attachment.data.filename,
              contentType: attachment.data.contentType,
            };
            if (attachment.data.path) att.path = attachment.data.path;
            if (attachment.data.content) att.content = attachment.data.content;
            emailAttachments.push(att);
          }
          break;
        case 'link':
          if (attachment.source === 'google-drive') {
            driveLinks.push({
              fileName: attachment.data.filename || '',
              link: attachment.data.url || '',
              ...(typeof attachment.data.size === 'number'
                ? { size: attachment.data.size }
                : {}),
            });
          } else if (attachment.source === 'aws-s3') {
            s3Links.push({
              fileName: attachment.data.filename || '',
              link: attachment.data.url || '',
            });
          } else {
            urlLinks.push({
              fileName: attachment.data.filename || '',
              link: attachment.data.url || '',
            });
          }
          break;
      }
    });

    return {
      attachments: emailAttachments,
      driveLinks,
      s3Links,
      urlLinks,
      hasLargeFiles:
        driveLinks.length > 0 || s3Links.length > 0 || urlLinks.length > 0,
    };
  }

  /**
   * Generate HTML content for file links
   * @param driveLinks - Google Drive links
   * @param s3Links - AWS S3 links
   * @param urlLinks - URL links
   * @returns HTML content
   */
  generateLinksHTML(
    driveLinks: DriveLink[] = [],
    s3Links: S3Link[] = [],
    urlLinks: UrlLink[] = []
  ): string {
    let html = '';

    if (driveLinks.length > 0) {
      html += '<h3>📁 Files Available on Google Drive:</h3><ul>';
      driveLinks.forEach(item => {
        const sizeMB = item.size ? (item.size / 1024 / 1024).toFixed(2) : '';
        html += `
          <li>
            <strong>${item.fileName}</strong>${
              sizeMB ? ` (${sizeMB} MB)` : ''
            }<br>
            <a href="${
              item.link
            }" target="_blank">📥 Download from Google Drive</a>
          </li>
        `;
      });
      html += '</ul>';
    }

    if (s3Links.length > 0) {
      html += '<h3>☁️ Files Available on AWS S3:</h3><ul>';
      s3Links.forEach(item => {
        html += `
          <li>
            <strong>${item.fileName}</strong><br>
            <a href="${item.link}" target="_blank">📥 Download from S3</a>
          </li>
        `;
      });
      html += '</ul>';
    }

    if (urlLinks.length > 0) {
      html += '<h3>🌐 Files Available via URL:</h3><ul>';
      urlLinks.forEach(item => {
        html += `
          <li>
            <strong>${item.fileName}</strong><br>
            <a href="${item.link}" target="_blank">📥 Download File</a>
          </li>
        `;
      });
      html += '</ul>';
    }

    return html;
  }
}

// Export singleton instance
export default new FileAttachmentManager();
