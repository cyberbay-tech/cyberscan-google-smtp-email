import { EmailResult, AttachmentConfig, UploadedFile } from './types';
/**
 * Send email with attachments from various sources
 * @param options - Email options with attachments
 * @returns Email result
 */
export declare function sendEmailWithAttachments(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    attachments?: AttachmentConfig[];
}): Promise<EmailResult>;
/**
 * Send email with local files
 * @param to - Recipient email
 * @param subject - Email subject
 * @param message - Email message
 * @param filePaths - Array of local file paths
 * @returns Result
 */
export declare function sendEmailWithLocalFiles(to: string, subject: string, message: string, filePaths: string[]): Promise<EmailResult>;
/**
 * Send email with mixed file sources
 * @param to - Recipient email
 * @param subject - Email subject
 * @param message - Email message
 * @param attachments - Array of attachment configurations
 * @returns Result
 */
export declare function sendEmailWithMixedAttachments(to: string, subject: string, message: string, attachments: AttachmentConfig[]): Promise<EmailResult>;
/**
 * Send email with uploaded files (from form data)
 * @param to - Recipient email
 * @param subject - Email subject
 * @param message - Email message
 * @param uploadedFiles - Array of uploaded file objects
 * @returns Result
 */
export declare function sendEmailWithUploadedFiles(to: string, subject: string, message: string, uploadedFiles: UploadedFile[]): Promise<EmailResult>;
/**
 * Send email with URLs
 * @param to - Recipient email
 * @param subject - Email subject
 * @param message - Email message
 * @param urls - Array of file URLs
 * @returns Result
 */
export declare function sendEmailWithUrls(to: string, subject: string, message: string, urls: string[]): Promise<EmailResult>;
//# sourceMappingURL=sendEmailWithAttachments.d.ts.map