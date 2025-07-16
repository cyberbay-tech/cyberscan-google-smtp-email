"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function requireEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`Missing required environment variable: ${name}`);
    return value;
}
const config = {
    gmail: {
        user: requireEnv('GMAIL_USER'),
        password: requireEnv('GMAIL_PASSWORD'),
        fromAlias: process.env['GMAIL_FROM_ALIAS'] || '',
        fromEmail: process.env['GMAIL_FROM_EMAIL'] || '',
        smtpHost: process.env['SMTP_HOST'] || 'smtp.gmail.com',
        smtpPort: parseInt(process.env['SMTP_PORT'] || '587', 10),
        smtpSecure: process.env['SMTP_SECURE'] === 'true',
        defaultTo: process.env['DEFAULT_TO_EMAIL'] || '',
    },
    googleDrive: {
        serviceAccountCredentials: process.env['GOOGLE_SERVICE_ACCOUNT_CREDENTIALS'] || '',
        folderId: process.env['GOOGLE_DRIVE_FOLDER_ID'] || '',
    },
    aws: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'] || '',
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] || '',
        region: process.env['AWS_REGION'] || 'us-east-1',
        s3Bucket: process.env['AWS_S3_BUCKET'] || '',
        s3BucketUrl: process.env['AWS_S3_BUCKET_URL'] || '',
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map