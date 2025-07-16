import nodemailer from 'nodemailer';
import { EmailOptions } from './types';
declare const transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
/**
 * Send email function
 * @param options - Email options including recipient, subject, content, and attachments
 * @returns Promise with email sending result
 */
export declare function sendEmail(options: EmailOptions): Promise<any>;
/**
 * Send a simple test email
 */
export declare function sendTestEmail(): Promise<void>;
/**
 * Send email with custom content
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param content - Email content
 */
export declare function sendCustomEmail(to: string, subject: string, content: string): Promise<void>;
export { transporter };
//# sourceMappingURL=sendEmail.d.ts.map