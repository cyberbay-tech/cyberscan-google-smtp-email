import { google } from 'googleapis';
import type { drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { GoogleDriveUploadResult } from './types';
import config from './config';
import { Readable } from 'stream';

async function getDrive(): Promise<drive_v3.Drive> {
  const credentials = JSON.parse(config.googleDrive.serviceAccountCredentials);
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
}

async function uploadFileToDrive(
  filePath: string,
  customName?: string
): Promise<GoogleDriveUploadResult> {
  const buffer = fs.readFileSync(filePath);
  const fileName = customName || path.basename(filePath);
  return uploadBufferToDrive(buffer, fileName);
}

async function uploadBufferToDrive(
  buffer: Buffer,
  fileName: string
): Promise<GoogleDriveUploadResult> {
  const drive = await getDrive();
  const fileMetadata: drive_v3.Schema$File = {
    name: fileName,
    parents: config.googleDrive.folderId ? [config.googleDrive.folderId] : null,
  };
  const media = {
    mimeType: 'application/octet-stream',
    body: Readable.from(buffer),
  };
  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id,name,size,webViewLink,webContentLink',
    supportsAllDrives: true,
  });
  return {
    fileId: response.data.id!,
    fileName: response.data.name!,
    fileSize: parseInt(response.data.size || '0', 10),
    viewLink: response.data.webViewLink!,
    downloadLink: response.data.webContentLink!,
    uploadTime: 0,
  };
}

async function makeFilePublic(fileId: string): Promise<string> {
  const drive = await getDrive();
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
    supportsAllDrives: true,
  });
  const response = await drive.files.get({
    fileId,
    fields: 'webContentLink',
    supportsAllDrives: true,
  });
  return response.data.webContentLink!;
}

async function deleteFileFromDrive(fileId: string): Promise<void> {
  const drive = await getDrive();
  await drive.files.delete({ fileId });
}

export default {
  uploadBufferToDrive,
  uploadFileToDrive,
  makeFilePublic,
  deleteFileFromDrive,
};
