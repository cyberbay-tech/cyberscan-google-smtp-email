import { google } from 'googleapis';
import type { drive_v3 } from 'googleapis';
import config from './config';

/**
 * Get authenticated Google Drive client using Service Account
 * @returns Promise with authenticated Drive client
 */
export async function getAuthenticatedDrive(): Promise<drive_v3.Drive> {
  try {
    if (!config.googleDrive.serviceAccountCredentials) {
      throw new Error(
        'Google Service Account credentials not found in environment variables'
      );
    }

    const credentials = JSON.parse(
      config.googleDrive.serviceAccountCredentials
    );
    const auth = new google.auth.JWT(
      credentials.client_email,
      undefined,
      credentials.private_key,
      [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
      ]
    );

    await auth.authorize();
    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error(
      '❌ Error authenticating with Google Service Account:',
      error
    );
    throw error;
  }
}

/**
 * Test Google Service Account authentication
 */
export async function testServiceAccountAuth(): Promise<void> {
  try {
    console.log('🔐 Testing Google Service Account authentication...');

    const drive = await getAuthenticatedDrive();

    // Test by listing files (limited to 1 to avoid large responses)
    const response = await drive.files.list({
      pageSize: 1,
      fields: 'files(id, name)',
    });

    console.log('✅ Google Service Account authentication successful!');
    console.log(`📁 Found ${response.data.files?.length || 0} files in Drive`);

    if (
      response.data.files &&
      response.data.files.length > 0 &&
      response.data.files[0]
    ) {
      console.log(
        `📄 Sample file: ${response.data.files[0].name} (ID: ${response.data.files[0].id})`
      );
    }
  } catch (error) {
    console.error('❌ Google Service Account authentication failed:', error);
    throw error;
  }
}

// If this file is run directly
if (require.main === module) {
  testServiceAccountAuth()
    .then(() => {
      console.log('🎉 Service Account test completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Service Account test failed:', error);
      process.exit(1);
    });
}
