"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mime = __importStar(require("mime-types"));
const client_s3_1 = require("@aws-sdk/client-s3");
const uploadToDriveServiceAccount_1 = __importDefault(require("./uploadToDriveServiceAccount"));
const config_1 = __importDefault(require("./config"));
/**
 * File Attachment Manager - Supports multiple file sources
 */
class FileAttachmentManager {
    constructor() {
        this.s3 = null;
        this.initializeS3();
    }
    /**
     * Initialize AWS S3 client
     */
    initializeS3() {
        if (config_1.default.aws.accessKeyId && config_1.default.aws.secretAccessKey) {
            this.s3 = new client_s3_1.S3Client({
                region: config_1.default.aws.region,
                credentials: {
                    accessKeyId: config_1.default.aws.accessKeyId,
                    secretAccessKey: config_1.default.aws.secretAccessKey,
                },
            });
        }
    }
    /**
     * Get file info (size, mime type, etc.)
     * @param filePath - Path to the file
     * @returns File information
     */
    getFileInfo(filePath) {
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
        }
        catch (error) {
            return {
                size: 0,
                sizeMB: '0',
                mimeType: 'application/octet-stream',
                name: path.basename(filePath),
                path: filePath,
                exists: false,
                error: error.message,
            };
        }
    }
    /**
     * Process file attachment based on source type
     * @param attachment - Attachment configuration
     * @returns Processed attachment result
     */
    async processAttachment(attachment) {
        const { source, path: filePath, name, type, content, url } = attachment;
        try {
            switch (source) {
                case 'local':
                    return await this.processLocalFile(filePath, name);
                case 'google-drive':
                    return await this.processGoogleDriveFile(filePath, name);
                case 'aws-s3':
                    return await this.processS3File(filePath, name);
                case 'upload':
                    return await this.processUploadedFile(content, name, type);
                case 'url':
                    return await this.processUrlFile(url, name);
                case 'buffer':
                    return await this.processBufferFile(content, name, type);
                default:
                    throw new Error(`Unsupported attachment source: ${source}`);
            }
        }
        catch (error) {
            const result = {
                success: false,
                error: error.message,
                source,
                type: 'attachment',
                data: {},
            };
            if (filePath)
                result.originalPath = filePath;
            return result;
        }
    }
    /**
     * Process local file attachment
     * @param filePath - Path to local file
     * @param name - Custom file name (optional)
     * @returns Attachment result
     */
    async processLocalFile(filePath, name) {
        console.log(`📁 Processing local file: ${filePath}`);
        const fileInfo = this.getFileInfo(filePath);
        if (!fileInfo.exists) {
            throw new Error(`File not found: ${filePath}`);
        }
        // Check file size for email attachment limit
        const maxEmailSize = 25 * 1024 * 1024; // 25MB
        if (fileInfo.size > maxEmailSize) {
            console.log(`⚠️ File too large for email (${fileInfo.sizeMB} MB), uploading to Google Drive...`);
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
    async processGoogleDriveFile(filePath, name) {
        console.log(`☁️ Processing Google Drive file: ${filePath}`);
        try {
            const uploadResult = await uploadToDriveServiceAccount_1.default.uploadFileToDrive(filePath, name);
            const publicLink = await uploadToDriveServiceAccount_1.default.makeFilePublic(uploadResult.fileId);
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
        }
        catch (error) {
            throw new Error(`Google Drive upload failed: ${error.message}`);
        }
    }
    /**
     * Process AWS S3 file attachment
     * @param filePath - Path to local file or S3 key
     * @param name - Custom file name (optional)
     * @returns Attachment result
     */
    async processS3File(filePath, name) {
        console.log(`☁️ Processing S3 file: ${filePath}`);
        if (!this.s3) {
            throw new Error('AWS S3 not configured. Please set AWS credentials in .env file.');
        }
        try {
            // If filePath is a local file, upload to S3 first
            if (fs.existsSync(filePath)) {
                const fileInfo = this.getFileInfo(filePath);
                const s3Key = `email-attachments/${Date.now()}-${fileInfo.name}`;
                const uploadParams = {
                    Bucket: config_1.default.aws.s3Bucket,
                    Key: s3Key,
                    Body: fs.createReadStream(filePath),
                    ContentType: fileInfo.mimeType,
                    ACL: 'public-read',
                };
                await this.s3.send(new client_s3_1.PutObjectCommand(uploadParams));
                const location = config_1.default.aws.s3BucketUrl
                    ? `${config_1.default.aws.s3BucketUrl}/${s3Key}`
                    : `https://${config_1.default.aws.s3Bucket}.s3.${config_1.default.aws.region}.amazonaws.com/${s3Key}`;
                return {
                    success: true,
                    source: 'aws-s3',
                    type: 'link',
                    data: {
                        filename: name || fileInfo.name,
                        url: location,
                        s3Key: s3Key,
                        ...(config_1.default.aws.s3Bucket ? { bucket: config_1.default.aws.s3Bucket } : {}),
                    },
                    info: fileInfo,
                };
            }
            else {
                // Assume filePath is an S3 key
                const s3Key = filePath;
                const url = config_1.default.aws.s3BucketUrl
                    ? `${config_1.default.aws.s3BucketUrl}/${s3Key}`
                    : `https://${config_1.default.aws.s3Bucket}.s3.${config_1.default.aws.region}.amazonaws.com/${s3Key}`;
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
        }
        catch (error) {
            throw new Error(`S3 processing failed: ${error.message}`);
        }
    }
    /**
     * Process uploaded file (from form data)
     * @param content - File content buffer
     * @param name - File name
     * @param type - MIME type
     * @returns Attachment result
     */
    async processUploadedFile(content, name, type) {
        console.log(`📤 Processing uploaded file: ${name}`);
        const maxEmailSize = 25 * 1024 * 1024; // 25MB
        const fileSize = content.length;
        if (fileSize > maxEmailSize) {
            console.log(`⚠️ Uploaded file too large (${(fileSize / 1024 / 1024).toFixed(2)} MB), saving to temp and uploading to Google Drive...`);
            // Save to temp file and upload to Google Drive
            const tempPath = path.join(__dirname, '..', 'temp', `${Date.now()}-${name}`);
            fs.mkdirSync(path.dirname(tempPath), { recursive: true });
            fs.writeFileSync(tempPath, content);
            try {
                const result = await this.processGoogleDriveFile(tempPath, name);
                // Clean up temp file
                fs.unlinkSync(tempPath);
                return result;
            }
            catch (error) {
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
    async processUrlFile(url, name) {
        console.log(`🌐 Processing URL file: ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
            }
            const content = await response.arrayBuffer();
            const buffer = Buffer.from(content);
            const contentType = response.headers.get('content-type') || 'application/octet-stream';
            const fileName = name || path.basename(url) || 'downloaded-file';
            return await this.processUploadedFile(buffer, fileName, contentType);
        }
        catch (error) {
            throw new Error(`URL processing failed: ${error.message}`);
        }
    }
    /**
     * Process buffer file attachment
     * @param content - File content buffer
     * @param name - File name
     * @param type - MIME type
     * @returns Attachment result
     */
    async processBufferFile(content, name, type) {
        console.log(`💾 Processing buffer file: ${name}`);
        return await this.processUploadedFile(content, name, type);
    }
    /**
     * Process multiple attachments
     * @param attachments - Array of attachment configurations
     * @returns Array of processed attachments
     */
    async processAttachments(attachments) {
        console.log(`📎 Processing ${attachments.length} attachments...`);
        const results = [];
        for (let i = 0; i < attachments.length; i++) {
            const attachment = attachments[i];
            if (!attachment)
                continue;
            console.log(`\n📎 Processing attachment ${i + 1}/${attachments.length}: ${attachment.name || attachment.path}`);
            try {
                const result = await this.processAttachment(attachment);
                results.push(result);
                console.log(`✅ Attachment ${i + 1} processed successfully`);
            }
            catch (error) {
                const failResult = {
                    success: false,
                    error: error.message,
                    source: attachment.source,
                    type: 'attachment',
                    data: {},
                };
                if (attachment.path)
                    failResult.originalPath = attachment.path;
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
    convertToEmailFormat(processedAttachments) {
        const emailAttachments = [];
        const driveLinks = [];
        const s3Links = [];
        const urlLinks = [];
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
                        const att = {
                            filename: attachment.data.filename,
                            contentType: attachment.data.contentType,
                        };
                        if (attachment.data.path)
                            att.path = attachment.data.path;
                        if (attachment.data.content)
                            att.content = attachment.data.content;
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
                    }
                    else if (attachment.source === 'aws-s3') {
                        s3Links.push({
                            fileName: attachment.data.filename || '',
                            link: attachment.data.url || '',
                        });
                    }
                    else {
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
            hasLargeFiles: driveLinks.length > 0 || s3Links.length > 0 || urlLinks.length > 0,
        };
    }
    /**
     * Generate HTML content for file links
     * @param driveLinks - Google Drive links
     * @param s3Links - AWS S3 links
     * @param urlLinks - URL links
     * @returns HTML content
     */
    generateLinksHTML(driveLinks = [], s3Links = [], urlLinks = []) {
        let html = '';
        if (driveLinks.length > 0) {
            html += '<h3>📁 Files Available on Google Drive:</h3><ul>';
            driveLinks.forEach(item => {
                const sizeMB = item.size ? (item.size / 1024 / 1024).toFixed(2) : '';
                html += `
          <li>
            <strong>${item.fileName}</strong>${sizeMB ? ` (${sizeMB} MB)` : ''}<br>
            <a href="${item.link}" target="_blank">📥 Download from Google Drive</a>
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
exports.default = new FileAttachmentManager();
//# sourceMappingURL=fileAttachmentManager.js.map