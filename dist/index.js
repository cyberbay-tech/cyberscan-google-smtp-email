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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToDriveServiceAccount = exports.sendEmailWithMixedAttachments = exports.sendEmailWithLocalFiles = exports.sendEmailWithAttachments = exports.sendEmail = void 0;
var sendEmail_1 = require("./sendEmail");
Object.defineProperty(exports, "sendEmail", { enumerable: true, get: function () { return sendEmail_1.sendEmail; } });
var sendEmailWithAttachments_1 = require("./sendEmailWithAttachments");
Object.defineProperty(exports, "sendEmailWithAttachments", { enumerable: true, get: function () { return sendEmailWithAttachments_1.sendEmailWithAttachments; } });
Object.defineProperty(exports, "sendEmailWithLocalFiles", { enumerable: true, get: function () { return sendEmailWithAttachments_1.sendEmailWithLocalFiles; } });
Object.defineProperty(exports, "sendEmailWithMixedAttachments", { enumerable: true, get: function () { return sendEmailWithAttachments_1.sendEmailWithMixedAttachments; } });
var uploadToDriveServiceAccount_1 = require("./uploadToDriveServiceAccount");
Object.defineProperty(exports, "uploadToDriveServiceAccount", { enumerable: true, get: function () { return __importDefault(uploadToDriveServiceAccount_1).default; } });
__exportStar(require("./fileAttachmentManager"), exports);
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map