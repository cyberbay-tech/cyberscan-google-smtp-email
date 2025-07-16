# Google Service Account Setup Guide

This guide will help you set up Google Service Account authentication for the email sending application, which is much more convenient than using OAuth2 refresh tokens.

## Why Service Account?

- **No user interaction required**: No need to authorize the application every time
- **Server-to-server authentication**: Perfect for automated systems
- **No refresh token management**: Credentials are always valid
- **Better security**: Can be scoped to specific folders and permissions

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click on it and press "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - **Name**: `email-attachment-service`
   - **Description**: `Service account for email attachment uploads`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Create and Download the Key

1. In the service accounts list, click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Click "Create" - this will download a JSON file
6. **Important**: Keep this file secure and never commit it to version control

## Step 4: Configure Environment Variables

1. Open your `.env.local` file
2. Add the service account credentials as a single line:

```env
# Google Service Account (replace with your actual JSON content)
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"email-attachment-service@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/email-attachment-service%40your-project.iam.gserviceaccount.com"}

# Optional: Google Drive folder ID (files will be uploaded to this folder)
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

## Step 5: Set Up Google Drive Permissions

### Option A: Use a Shared Drive (Recommended)

1. Create a shared drive in Google Drive
2. Add your service account email as a member with "Editor" permissions
3. Get the folder ID from the URL when you open the shared drive
4. Set `GOOGLE_DRIVE_FOLDER_ID` to this folder ID

### Option B: Use Your Personal Drive

1. Share a folder in your Google Drive with the service account email
2. Give it "Editor" permissions
3. Get the folder ID from the URL when you open the folder
4. Set `GOOGLE_DRIVE_FOLDER_ID` to this folder ID

## Step 6: Test the Setup

Run the test script to verify everything is working:

```bash
npm run test:google-service-account
```

Or manually:

```bash
npx ts-node src/googleServiceAccountAuth.ts
```

## Step 7: Update Your Application

Replace the old OAuth2 authentication with the new service account:

```typescript
// Old way (OAuth2) - REMOVED
// import { uploadFileToDrive } from './uploadToDrive';

// New way (Service Account)
import { uploadFileToDrive } from './uploadToDriveServiceAccount';
```

## Security Best Practices

1. **Never commit credentials**: The JSON key file should never be in version control
2. **Use environment variables**: Store credentials in environment variables, not in code
3. **Limit permissions**: Only grant the minimum necessary permissions to the service account
4. **Rotate keys**: Regularly rotate your service account keys
5. **Monitor usage**: Set up alerts for unusual API usage

## Troubleshooting

### "Invalid credentials" error
- Check that the JSON credentials are properly formatted
- Ensure the service account has the necessary permissions
- Verify the Google Drive API is enabled

### "Permission denied" error
- Make sure the service account has access to the target folder
- Check that the folder ID is correct
- Verify the service account email was added to the shared drive

### "API not enabled" error
- Go to Google Cloud Console and enable the Google Drive API
- Wait a few minutes for the changes to propagate

## Migration from OAuth2

If you're migrating from the old OAuth2 system:

1. Set up the service account as described above
2. Update your environment variables to use `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS`
3. Remove the old OAuth2-related environment variables:
   - `GOOGLE_DRIVE_CLIENT_ID`
   - `GOOGLE_DRIVE_CLIENT_SECRET`
   - `GOOGLE_DRIVE_REDIRECT_URI`
   - `GOOGLE_DRIVE_REFRESH_TOKEN`
4. Update your imports to use the new service account files
5. Test thoroughly before deploying

## Example Usage

```typescript
import { uploadFileToDrive } from './uploadToDriveServiceAccount';

// Upload a single file
const result = await uploadFileToDrive('/path/to/file.pdf', 'custom-name.pdf');
console.log(`File uploaded: ${result.viewLink}`);

// Upload multiple files
const results = await uploadMultipleFilesToDrive([
  '/path/to/file1.pdf',
  '/path/to/file2.zip'
]);
```

This setup provides a much more robust and convenient authentication method for your email attachment system! 