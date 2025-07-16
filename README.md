# cyberscan-google-smtp-email

A Node.js/TypeScript library for sending emails with attachments (local, Google Drive, AWS S3, URLs, buffers) via Gmail SMTP, with Google Drive Service Account integration and flexible alias support.

## Features

- ✅ **TypeScript Support**: Fully typed with proper interfaces and type safety
- 📧 **Email Sending**: Send emails via Gmail SMTP with proper authentication
- 🏷️ **Alias Support**: Custom sender names and email addresses
- 📎 **Multiple Attachment Sources**:
  - Local files
  - Google Drive (with Service Account authentication)
  - AWS S3
  - Uploaded files (from forms)
  - URLs
  - Buffer content
- 🔄 **Automatic File Handling**: Small files attached directly, large files uploaded to cloud storage
- ☁️ **Cloud Integration**: Google Drive and AWS S3 support for large file storage
- 🛡️ **Security**: Environment variable configuration, no hardcoded credentials
- 📊 **Comprehensive Logging**: Detailed progress and error reporting
- 🧪 **Testing**: Jest test suite with proper TypeScript support

## Installation

### From npm (Recommended)

```bash
npm install cyberscan-google-smtp-email
```

### From GitHub

```bash
# Install directly from GitHub
npm install git+https://github.com/cyberbay-tech/cyberscan-google-smtp-email.git

# Or with specific branch/tag
npm install git+https://github.com/cyberbay-tech/cyberscan-google-smtp-email.git#main
npm install git+https://github.com/cyberbay-tech/cyberscan-google-smtp-email.git#v1.2.0
```

### Using yarn

```bash
yarn add cyberscan-google-smtp-email
```

### Using pnpm

```bash
pnpm add cyberscan-google-smtp-email
```

## Quick Start

### 1. Install the Library

```bash
npm install cyberscan-google-smtp-email
```

### 2. Configure Environment Variables

Create a `.env.local` file with your credentials:

```env
# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
GMAIL_FROM_ALIAS=Your Name
GMAIL_FROM_EMAIL=your-email@gmail.com

# SMTP Settings (optional, defaults shown)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Default recipient (optional)
DEFAULT_TO_EMAIL=recipient@example.com

# Google Service Account (Recommended)
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_S3_BUCKET_URL=https://your-bucket-name.s3.amazonaws.com
```

### 3. Set Up Google Service Account (Recommended)

For Google Drive integration, use Service Account authentication:

1. Follow the [Google Service Account Setup Guide](docs/SETUP_GOOGLE_SERVICE_ACCOUNT.md)
2. This is much more convenient than OAuth2 refresh tokens
3. No user interaction required, perfect for automated systems

### 4. Basic Usage

```typescript
import {
  sendEmail,
  sendEmailWithAttachments,
  sendEmailWithLocalFiles,
  sendEmailWithMixedAttachments,
  uploadToDriveServiceAccount,
} from 'cyberscan-google-smtp-email';

// Send a basic email
await sendEmail({
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'Hello World!',
  html: '<h1>Hello World!</h1>',
});

// Send email with custom alias
await sendEmail({
  to: 'recipient@example.com',
  subject: 'Support Response',
  text: 'Thank you for contacting support.',
  html: '<p>Thank you for contacting support.</p>',
  fromAlias: 'Support Team',
  fromEmail: 'support@yourdomain.com',
});

// Send email with local files
await sendEmailWithLocalFiles(
  'recipient@example.com',
  'Files Attached',
  'Please find the attached files.',
  ['/path/to/file1.pdf', '/path/to/file2.zip']
);

// Upload a file to Google Drive
const result = await uploadToDriveServiceAccount.uploadFileToDrive(
  '/path/to/large-file.pdf'
);
console.log(result.viewLink);
```

## Configuration

### Environment Variables

Create a `.env.local` file with your credentials:

```env
# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
GMAIL_FROM_ALIAS=Your Name
GMAIL_FROM_EMAIL=your-email@gmail.com

# SMTP Settings (optional, defaults shown)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Default recipient (optional)
DEFAULT_TO_EMAIL=recipient@example.com

# Google Service Account (Recommended)
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
AWS_S3_BUCKET_URL=https://your-bucket-name.s3.amazonaws.com
```

### Configuration Priority

The library uses a priority system for configuration:

1. **EmailOptions alias** (highest priority) - passed directly to functions
2. **Environment variables** - loaded via config.ts
3. **Hardcoded defaults** (lowest priority) - fallback values

## API Reference

### Core Functions

#### `sendEmail(options: EmailOptions)`

Send a basic email with optional attachments and alias support.

```typescript
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
  fromAlias?: string; // Custom sender name
  fromEmail?: string; // Custom sender email
}
```

**Examples:**

```typescript
// Basic email
await sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  text: 'Hello World!',
});

// Email with custom alias
await sendEmail({
  to: 'user@example.com',
  subject: 'Support',
  text: 'Thank you!',
  fromAlias: 'Support Team',
  fromEmail: 'support@company.com',
});
```

#### `sendEmailWithLocalFiles(to, subject, message, filePaths)`

Send email with local file attachments.

```typescript
await sendEmailWithLocalFiles(
  'user@example.com',
  'Files Attached',
  'Please find attached files.',
  ['/path/to/file1.pdf', '/path/to/file2.zip']
);
```

#### `sendEmailWithMixedAttachments(to, subject, message, attachments)`

Send email with mixed attachment sources.

```typescript
const attachments = [
  { source: 'local', path: '/path/to/local/file.pdf' },
  { source: 'google-drive', path: '/path/to/drive/file.zip' },
  { source: 'aws-s3', path: '/path/to/s3/file.mp4' },
  { source: 'url', url: 'https://example.com/file.pdf' },
];

await sendEmailWithMixedAttachments(
  'user@example.com',
  'Mixed Attachments',
  'Files from various sources.',
  attachments
);
```

#### `uploadToDriveServiceAccount.uploadFileToDrive(filePath, customName?)`

Upload a file to Google Drive using Service Account authentication.

```typescript
const result = await uploadToDriveServiceAccount.uploadFileToDrive(
  '/path/to/large-file.pdf',
  'custom-name.pdf'
);
console.log(`File uploaded: ${result.viewLink}`);
```

### Attachment Sources

The library supports multiple attachment sources:

#### Local Files

```typescript
{ source: 'local', path: '/path/to/file.pdf' }
```

#### Google Drive Files

```typescript
{ source: 'google-drive', path: '/path/to/drive/file.zip' }
```

#### AWS S3 Files

```typescript
{ source: 'aws-s3', path: 'documents/report.pdf' }
```

#### URL Files

```typescript
{ source: 'url', url: 'https://example.com/file.pdf' }
```

#### Buffer Content

```typescript
{ source: 'buffer', content: Buffer.from('Hello'), name: 'file.txt', type: 'text/plain' }
```

#### Uploaded Files

```typescript
{ source: 'upload', content: fileBuffer, name: 'uploaded.pdf', type: 'application/pdf' }
```

## Advanced Usage

### Custom Alias Configuration

You can set default aliases in environment variables or override them per email:

```typescript
// Use environment defaults
await sendEmail({
  to: 'user@example.com',
  subject: 'Test',
  text: 'Hello',
});

// Override with custom alias
await sendEmail({
  to: 'user@example.com',
  subject: 'Support',
  text: 'Thank you!',
  fromAlias: 'Support Team',
  fromEmail: 'support@company.com',
});
```

### Large File Handling

The library automatically handles large files:

- **Small files** (< 25MB): Attached directly to email
- **Large files** (≥ 25MB): Uploaded to Google Drive/S3 and linked

```typescript
// Large files are automatically uploaded to cloud storage
await sendEmailWithLocalFiles(
  'user@example.com',
  'Large Files',
  'Large files will be uploaded to cloud storage.',
  ['/path/to/large-video.mp4', '/path/to/database-backup.zip']
);
```

### Error Handling

All functions return structured results with error information:

```typescript
try {
  const result = await sendEmailWithAttachments({
    to: 'user@example.com',
    subject: 'Test',
    text: 'Hello',
    attachments: [{ source: 'local', path: '/path/to/file.pdf' }],
  });

  if (result.success) {
    console.log('Email sent successfully!');
    console.log(`Attachments processed: ${result.attachmentsProcessed}`);
  } else {
    console.error('Email failed:', result.error);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

## Repository Setup for Development

#### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/cyberbay-tech/cyberscan-google-smtp-email.git
cd cyberscan-google-smtp-email

# Or using SSH
git clone git@github.com:cyberbay-tech/cyberscan-google-smtp-email.git
cd cyberscan-google-smtp-email
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your credentials
nano .env.local
```

#### 4. Build the Project

```bash
npm run build
```

#### 5. Test the Setup

```bash
# Test basic email sending
npm run test:email

# Test Google Service Account
npm run test:google-service-account

# Run all tests
npm test
```

## Documentation

📚 **Complete documentation is available in the [docs/](docs/) directory.**

### Quick Links

- [📖 Documentation Overview](docs/README.md) - Complete documentation index
- [🚀 Quick Start Guide](docs/QUICK_START.md) - Get up and running quickly
- [🔧 Google Service Account Setup](docs/SETUP_GOOGLE_SERVICE_ACCOUNT.md) - Configure Google Drive integration
- [📧 Google Group Alias Setup](docs/SETUP_GOOGLE_GROUP_ALIAS.md) - Set up email aliases with Google Groups
- [🤖 GitHub Actions Guide](docs/GITHUB_ACTIONS.md) - CI/CD workflows and automation

## CI/CD Pipeline

This project uses GitHub Actions for automated testing, linting, and deployment:

### 🤖 Automated Workflows

- **CI/CD Pipeline** - Runs on every push and PR
  - Tests on Node.js 18, 20, and 21
  - ESLint code quality checks
  - TypeScript type checking
  - Jest test suite with coverage
  - Build verification
  - Security audits

- **Pull Request Checks** - Enhanced PR experience
  - Merge conflict detection
  - Code quality validation
  - Automated PR comments with results
  - Bundle size checks

- **Release Automation** - Automatic npm publishing
  - Triggers on GitHub releases
  - Runs full test suite
  - Publishes to npm registry

- **Documentation Validation** - Ensures docs quality
  - Markdown linting
  - Broken link detection
  - Documentation structure validation

- **Dependency Updates** - Weekly security checks
  - Automated dependency monitoring
  - Security vulnerability scanning
  - Creates issues for manual review

### 🛠️ Local Development

All CI checks can be run locally:

```bash
# Run all checks
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run format:check  # Prettier
npm test             # Jest tests
npm run test:coverage # Test coverage
npm run build        # Build verification
```

### 📊 Status Badges

The project includes status badges showing:

- CI/CD pipeline status
- Release status
- PR check status
- Documentation validation
- npm version and downloads
- License and technology badges

## Security Notes

1. **Never commit credentials**: All sensitive data should be in `.env.local` (already in `.gitignore`)
2. **Use App Passwords**: For Gmail, use App Passwords instead of your regular password
3. **Service Account Security**: Keep service account keys secure and rotate regularly
4. **Environment Variables**: All credentials stored in environment variables
5. **Type Safety**: No `any` types to prevent runtime errors

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- sendEmail.test.ts

# Run with coverage
npm run test:coverage
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check
```

### Building

```bash
# Compile TypeScript
npm run build

# Clean build files
npm run clean
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Gmail Authentication**: Use App Passwords, not your regular password
2. **Google Drive Permissions**: Ensure service account has access to target folder
3. **AWS S3 Permissions**: Check bucket permissions and IAM roles
4. **File Size Limits**: Large files are automatically uploaded to cloud storage

### Getting Help

1. Check the [documentation](docs/) for detailed guides and examples
2. Review the [Quick Start Guide](docs/QUICK_START.md) for basic usage
3. Check the setup guides in the [docs/](docs/) folder for specific integrations
4. Review the test files for usage examples
5. Check the TypeScript interfaces in `src/types/`
6. Run tests to verify your configuration
7. Open an issue on GitHub if you need help

## License

MIT License - see LICENSE file for details.

## Repository

- **GitHub**: https://github.com/cyberbay-tech/cyberscan-google-smtp-email
- **npm**: https://www.npmjs.com/package/cyberscan-google-smtp-email
