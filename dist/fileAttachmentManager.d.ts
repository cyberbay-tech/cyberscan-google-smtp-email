import { AttachmentConfig, FileInfo, ProcessedAttachment, EmailFormat, DriveLink, S3Link, UrlLink } from './types';
/**
 * File Attachment Manager - Supports multiple file sources
 */
declare class FileAttachmentManager {
    private s3;
    constructor();
    /**
     * Initialize AWS S3 client
     */
    private initializeS3;
    /**
     * Get file info (size, mime type, etc.)
     * @param filePath - Path to the file
     * @returns File information
     */
    getFileInfo(filePath: string): FileInfo;
    /**
     * Process file attachment based on source type
     * @param attachment - Attachment configuration
     * @returns Processed attachment result
     */
    processAttachment(attachment: AttachmentConfig): Promise<ProcessedAttachment>;
    /**
     * Process local file attachment
     * @param filePath - Path to local file
     * @param name - Custom file name (optional)
     * @returns Attachment result
     */
    private processLocalFile;
    /**
     * Process Google Drive file attachment
     * @param filePath - Path to local file
     * @param name - Custom file name (optional)
     * @returns Attachment result
     */
    private processGoogleDriveFile;
    /**
     * Process AWS S3 file attachment
     * @param filePath - Path to local file or S3 key
     * @param name - Custom file name (optional)
     * @returns Attachment result
     */
    private processS3File;
    /**
     * Process uploaded file (from form data)
     * @param content - File content buffer
     * @param name - File name
     * @param type - MIME type
     * @returns Attachment result
     */
    private processUploadedFile;
    /**
     * Process URL file attachment
     * @param url - File URL
     * @param name - Custom file name (optional)
     * @returns Attachment result
     */
    private processUrlFile;
    /**
     * Process buffer file attachment
     * @param content - File content buffer
     * @param name - File name
     * @param type - MIME type
     * @returns Attachment result
     */
    private processBufferFile;
    /**
     * Process multiple attachments
     * @param attachments - Array of attachment configurations
     * @returns Array of processed attachments
     */
    processAttachments(attachments: AttachmentConfig[]): Promise<ProcessedAttachment[]>;
    /**
     * Convert processed attachments to email format
     * @param processedAttachments - Array of processed attachments
     * @returns Email attachments and links
     */
    convertToEmailFormat(processedAttachments: ProcessedAttachment[]): EmailFormat;
    /**
     * Generate HTML content for file links
     * @param driveLinks - Google Drive links
     * @param s3Links - AWS S3 links
     * @param urlLinks - URL links
     * @returns HTML content
     */
    generateLinksHTML(driveLinks?: DriveLink[], s3Links?: S3Link[], urlLinks?: UrlLink[]): string;
}
declare const _default: FileAttachmentManager;
export default _default;
//# sourceMappingURL=fileAttachmentManager.d.ts.map