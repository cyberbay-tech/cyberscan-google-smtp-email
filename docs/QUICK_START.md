# Quick Start Guide

Get up and running with the TypeScript email sending project in minutes!

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Google account (for Gmail SMTP)
- Google Cloud account (for large file uploads)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd send-email
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

## Basic Setup

1. **Configure environment variables**:
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` with your Gmail credentials**:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=your-app-password
   GMAIL_FROM_ALIAS=Your Name
   GMAIL_FROM_EMAIL=your-email@gmail.com
   ```

3. **Test basic email sending**:
   ```bash
   npm start
   ```

## Quick Examples

### Send a simple email
```bash
npm run dev
# This will send a test email to the address in your .env file
```

### Send email with local files
```bash
npm run send-attachments recipient@example.com "Test Email" "Please find attached files" file1.pdf file2.zip
```

### Upload large files to Google Drive
```bash
npm run upload large-file.pdf
```

### Run examples
```bash
npm run examples
```

## Development

### Development mode
```bash
npm run dev
```

### Run tests
```bash
npm test
```

### Lint code
```bash
npm run lint
```

### Clean build
```bash
npm run clean
npm run build
```

## Common Issues

### "Gmail password not configured"
- Use an App Password, not your regular Gmail password
- Enable 2-Factor Authentication on your Google account
- Generate an App Password in Google Account Settings

### "Cannot find module" errors
- Run `npm install` to install dependencies
- Run `npm run build` to compile TypeScript
- Check that all environment variables are set

### TypeScript compilation errors
- Check `tsconfig.json` configuration
- Ensure all imports are correct
- Run `npm run lint` to see detailed errors

## Next Steps

1. **Set up Google Drive** (for large files):
   - Follow [SETUP_GOOGLE_SERVICE_ACCOUNT.md](./SETUP_GOOGLE_SERVICE_ACCOUNT.md)
   - Configure Google Service Account credentials

2. **Set up AWS S3** (optional):
   - Add AWS credentials to `.env`
   - Configure S3 bucket permissions

3. **Explore examples**:
   - Run `npm run examples` to see all features
   - Check `src/attachmentExamples.ts` for code examples

4. **Customize for your needs**:
   - Modify email templates
   - Add custom file processing
   - Integrate with your application

## Support

- **Documentation**: Check [README.md](./README.md) for full documentation
- **Google Drive Setup**: See [SETUP_GOOGLE_SERVICE_ACCOUNT.md](./SETUP_GOOGLE_SERVICE_ACCOUNT.md)
- **Google Group Alias**: See [SETUP_GOOGLE_GROUP_ALIAS.md](./SETUP_GOOGLE_GROUP_ALIAS.md)
- **Issues**: Check the project's issue tracker

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm start` | Run the main email script |
| `npm run dev` | Development mode with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run test` | Run unit tests |
| `npm run lint` | Check code quality |
| `npm run clean` | Clean build files |
| `npm run send-attachments` | Send email with file attachments |
| `npm run examples` | Run all examples |
| `npm run upload` | Upload files to Google Drive |

Happy coding! 🚀 