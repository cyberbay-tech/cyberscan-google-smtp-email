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
const googleapis_1 = require("googleapis");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const config_1 = __importDefault(require("./config"));
const stream_1 = require("stream");
async function getDrive() {
    const credentials = JSON.parse(config_1.default.googleDrive.serviceAccountCredentials);
    const auth = new googleapis_1.google.auth.JWT(credentials.client_email, undefined, credentials.private_key, [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
    ]);
    await auth.authorize();
    return googleapis_1.google.drive({ version: 'v3', auth });
}
async function uploadFileToDrive(filePath, customName) {
    const buffer = fs.readFileSync(filePath);
    const fileName = customName || path.basename(filePath);
    return uploadBufferToDrive(buffer, fileName);
}
async function uploadBufferToDrive(buffer, fileName) {
    const drive = await getDrive();
    const fileMetadata = {
        name: fileName,
        parents: config_1.default.googleDrive.folderId ? [config_1.default.googleDrive.folderId] : null,
    };
    const media = {
        mimeType: 'application/octet-stream',
        body: stream_1.Readable.from(buffer),
    };
    const response = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id,name,size,webViewLink,webContentLink',
        supportsAllDrives: true,
    });
    return {
        fileId: response.data.id,
        fileName: response.data.name,
        fileSize: parseInt(response.data.size || '0', 10),
        viewLink: response.data.webViewLink,
        downloadLink: response.data.webContentLink,
        uploadTime: 0,
    };
}
async function makeFilePublic(fileId) {
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
    return response.data.webContentLink;
}
async function deleteFileFromDrive(fileId) {
    const drive = await getDrive();
    await drive.files.delete({ fileId });
}
exports.default = {
    uploadBufferToDrive,
    uploadFileToDrive,
    makeFilePublic,
    deleteFileFromDrive,
};
//# sourceMappingURL=uploadToDriveServiceAccount.js.map