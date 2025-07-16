import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
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
    serviceAccountCredentials:
      process.env['GOOGLE_SERVICE_ACCOUNT_CREDENTIALS'] || '',
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

export default config;
