"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailWithAttachments = sendEmailWithAttachments;
exports.sendEmailWithLocalFiles = sendEmailWithLocalFiles;
exports.sendEmailWithMixedAttachments = sendEmailWithMixedAttachments;
exports.sendEmailWithUploadedFiles = sendEmailWithUploadedFiles;
exports.sendEmailWithUrls = sendEmailWithUrls;
const sendEmail_1 = require("./sendEmail");
const fileAttachmentManager_1 = __importDefault(require("./fileAttachmentManager"));
const config_1 = __importDefault(require("./config"));
/**
 * Send email with attachments from various sources
 * @param options - Email options with attachments
 * @returns Email result
 */
async function sendEmailWithAttachments(options) {
    try {
        console.log('🚀 Starting email with attachments...');
        console.log(`📧 To: ${options.to}`);
        console.log(`📝 Subject: ${options.subject}`);
        console.log(`📎 Attachments: ${options.attachments ? options.attachments.length : 0} files`);
        let emailAttachments = [];
        let linksHTML = '';
        // Process attachments if provided
        if (options.attachments && options.attachments.length > 0) {
            console.log('\n📎 Processing attachments...');
            const processedAttachments = await fileAttachmentManager_1.default.processAttachments(options.attachments);
            const emailFormat = fileAttachmentManager_1.default.convertToEmailFormat(processedAttachments);
            emailAttachments = emailFormat.attachments;
            linksHTML = fileAttachmentManager_1.default.generateLinksHTML(emailFormat.driveLinks, emailFormat.s3Links, emailFormat.urlLinks);
            console.log(`\n📊 Attachment Summary:`);
            console.log(`✅ Email attachments: ${emailFormat.attachments.length}`);
            console.log(`☁️ Google Drive links: ${emailFormat.driveLinks.length}`);
            console.log(`☁️ S3 links: ${emailFormat.s3Links.length}`);
            console.log(`🌐 URL links: ${emailFormat.urlLinks.length}`);
        }
        // Prepare email content
        let htmlContent = options.html || options.text;
        // Add file links to HTML content if any
        if (linksHTML) {
            htmlContent += `
        <hr>
        ${linksHTML}
        <hr>
      `;
        }
        // Send email
        const emailOptions = {
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: htmlContent,
            attachments: emailAttachments,
        };
        const result = await (0, sendEmail_1.sendEmail)(emailOptions);
        console.log('✅ Email with attachments sent successfully!');
        return {
            success: true,
            emailResult: result,
            attachmentsProcessed: options.attachments
                ? options.attachments.length
                : 0,
        };
    }
    catch (error) {
        console.error('❌ Error sending email with attachments:', error);
        throw error;
    }
}
/**
 * Send email with local files
 * @param to - Recipient email
 * @param subject - Email subject
 * @param message - Email message
 * @param filePaths - Array of local file paths
 * @returns Result
 */
async function sendEmailWithLocalFiles(to, subject, message, filePaths) {
    const attachments = filePaths.map(filePath => ({
        source: 'local',
        path: filePath,
    }));
    return await sendEmailWithAttachments({
        to,
        subject,
        text: message,
        html: message.replace(/\n/g, '<br>'),
        attachments,
    });
}
/**
 * Send email with mixed file sources
 * @param to - Recipient email
 * @param subject - Email subject
 * @param message - Email message
 * @param attachments - Array of attachment configurations
 * @returns Result
 */
async function sendEmailWithMixedAttachments(to, subject, message, attachments) {
    return await sendEmailWithAttachments({
        to,
        subject,
        text: message,
        html: message.replace(/\n/g, '<br>'),
        attachments,
    });
}
/**
 * Send email with uploaded files (from form data)
 * @param to - Recipient email
 * @param subject - Email subject
 * @param message - Email message
 * @param uploadedFiles - Array of uploaded file objects
 * @returns Result
 */
async function sendEmailWithUploadedFiles(to, subject, message, uploadedFiles) {
    const attachments = uploadedFiles
        .filter(file => file.buffer || file.data) // Only include files with content
        .map(file => ({
        source: 'upload',
        content: (file.buffer || file.data),
        name: file.originalname || file.name || 'uploaded-file',
        type: file.mimetype || file.type || 'application/octet-stream',
    }));
    return await sendEmailWithAttachments({
        to,
        subject,
        text: message,
        html: message.replace(/\n/g, '<br>'),
        attachments,
    });
}
/**
 * Send email with URLs
 * @param to - Recipient email
 * @param subject - Email subject
 * @param message - Email message
 * @param urls - Array of file URLs
 * @returns Result
 */
async function sendEmailWithUrls(to, subject, message, urls) {
    const attachments = urls.map(url => ({
        source: 'url',
        url: url,
    }));
    return await sendEmailWithAttachments({
        to,
        subject,
        text: message,
        html: message.replace(/\n/g, '<br>'),
        attachments,
    });
}
// If this file is run directly
if (require.main === module) {
    console.log('🚀 Email with Attachments Script');
    console.log('Usage: node sendEmailWithAttachments.js <recipient_email> <subject> <message> <file1> [file2] [file3] ...');
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log('\n📋 Example usage:');
        console.log('node sendEmailWithAttachments.js "user@example.com" "Test Subject" "Hello World" file1.pdf file2.zip');
        process.exit(1);
    }
    const [recipient, subject, message, ...filePaths] = args;
    if (!recipient || !subject || !message) {
        console.error('❌ Missing required parameters: recipient, subject, or message');
        process.exit(1);
    }
    // Check environment variables
    if (!config_1.default.gmail.password) {
        console.error('❌ Error: Gmail password not configured!');
        console.log('Please set up your .env file with Gmail credentials.');
        process.exit(1);
    }
    // Send email with local files
    sendEmailWithLocalFiles(recipient, subject, message, filePaths)
        .then(result => {
        if (result.success) {
            console.log('\n✅ Email sent successfully!');
            console.log(`📎 Attachments processed: ${result.attachmentsProcessed}`);
        }
        else {
            console.error('\n❌ Email failed:', result.error);
            process.exit(1);
        }
    })
        .catch(error => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=sendEmailWithAttachments.js.map