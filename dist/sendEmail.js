"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.sendEmail = sendEmail;
exports.sendTestEmail = sendTestEmail;
exports.sendCustomEmail = sendCustomEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("./config"));
// Email configuration from config.ts
const emailConfig = {
    host: config_1.default.gmail.smtpHost,
    port: config_1.default.gmail.smtpPort,
    secure: config_1.default.gmail.smtpSecure,
    auth: {
        user: config_1.default.gmail.user,
        pass: config_1.default.gmail.password,
    },
};
// Create transporter
const transporter = nodemailer_1.default.createTransport(emailConfig);
exports.transporter = transporter;
/**
 * Send email function
 * @param options - Email options including recipient, subject, content, and attachments
 * @returns Promise with email sending result
 */
async function sendEmail(options) {
    const mailOptions = {
        from: `"${options.fromAlias || config_1.default.gmail.fromAlias || 'Your Company'}" <${options.fromEmail || config_1.default.gmail.fromEmail || config_1.default.gmail.user}>`,
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
async function sendTestEmail() {
    const testOptions = {
        to: config_1.default.gmail.defaultTo || config_1.default.gmail.user,
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
async function sendCustomEmail(to, subject, content) {
    const emailOptions = {
        to,
        subject,
        text: content,
        html: content.replace(/\n/g, '<br>'),
    };
    await sendEmail(emailOptions);
}
//# sourceMappingURL=sendEmail.js.map