import nodemailer from 'nodemailer';
import config from './config';
import { EmailConfig, EmailOptions } from './types';

// Email configuration from config.ts
const emailConfig: EmailConfig = {
  host: config.gmail.smtpHost,
  port: config.gmail.smtpPort,
  secure: config.gmail.smtpSecure,
  auth: {
    user: config.gmail.user,
    pass: config.gmail.password,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

/**
 * Send email function
 * @param options - Email options including recipient, subject, content, and attachments
 * @returns Promise with email sending result
 */
export async function sendEmail(options: EmailOptions): Promise<any> {
  const mailOptions = {
    from: `"${options.fromAlias || config.gmail.fromAlias || 'Your Company'}" <${
      options.fromEmail || config.gmail.fromEmail || config.gmail.user
    }>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments || [],
  };
  return transporter.sendMail(mailOptions);
}

/**
 * Send a simple test email
 */
export async function sendTestEmail(): Promise<void> {
  const testOptions: EmailOptions = {
    to: config.gmail.defaultTo || config.gmail.user,
    subject: 'Test Email from Email Service',
    text: 'This is a test email sent from the email service script.',
    html: `
      <h2>Test Email from Email Service</h2>
      <p>This is a test email sent from the email service script.</p>
      <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <p><em>Best regards,<br>Email Service Team</em></p>
    `,
  };
  await sendEmail(testOptions);
}

/**
 * Send email with custom content
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param content - Email content
 */
export async function sendCustomEmail(
  to: string,
  subject: string,
  content: string
): Promise<void> {
  const emailOptions: EmailOptions = {
    to,
    subject,
    text: content,
    html: content.replace(/\n/g, '<br>'),
  };
  await sendEmail(emailOptions);
}

export { transporter };
