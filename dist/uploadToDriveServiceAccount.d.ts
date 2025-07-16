import { GoogleDriveUploadResult } from './types';
declare function uploadFileToDrive(filePath: string, customName?: string): Promise<GoogleDriveUploadResult>;
declare function uploadBufferToDrive(buffer: Buffer, fileName: string): Promise<GoogleDriveUploadResult>;
declare function makeFilePublic(fileId: string): Promise<string>;
declare function deleteFileFromDrive(fileId: string): Promise<void>;
declare const _default: {
    uploadBufferToDrive: typeof uploadBufferToDrive;
    uploadFileToDrive: typeof uploadFileToDrive;
    makeFilePublic: typeof makeFilePublic;
    deleteFileFromDrive: typeof deleteFileFromDrive;
};
export default _default;
//# sourceMappingURL=uploadToDriveServiceAccount.d.ts.map