"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleLocalFiles = exampleLocalFiles;
exports.exampleMixedSources = exampleMixedSources;
exports.exampleUploadedFiles = exampleUploadedFiles;
exports.exampleBufferFiles = exampleBufferFiles;
exports.exampleUrlFiles = exampleUrlFiles;
exports.exampleLargeFiles = exampleLargeFiles;
exports.exampleS3Files = exampleS3Files;
exports.exampleProcessOnly = exampleProcessOnly;
exports.runAllExamples = runAllExamples;
const sendEmailWithAttachments_1 = require("./sendEmailWithAttachments");
const fileAttachmentManager_1 = __importDefault(require("./fileAttachmentManager"));
/**
 * Example 1: Send email with local files only
 */
async function exampleLocalFiles() {
    console.log('📧 Example 1: Sending email with local files...');
    try {
        await (0, sendEmailWithAttachments_1.sendEmailWithAttachments)({
            to: 'recipient@example.com',
            subject: 'Local Files Example',
            text: 'Please find the attached local files.',
            attachments: [
                { source: 'local', path: './documents/report.pdf' },
                { source: 'local', path: './images/logo.png' },
                { source: 'local', path: './data/spreadsheet.xlsx' },
            ],
        });
    }
    catch (error) {
        console.error('Example 1 failed:', error);
    }
}
/**
 * Example 2: Send email with mixed file sources
 */
async function exampleMixedSources() {
    console.log('📧 Example 2: Sending email with mixed file sources...');
    try {
        await (0, sendEmailWithAttachments_1.sendEmailWithMixedAttachments)('recipient@example.com', 'Mixed Sources Example', 'This email contains files from different sources.', [
            // Local file (small - will be attached directly)
            { source: 'local', path: './documents/small-doc.pdf' },
            // Local file (large - will be uploaded to Google Drive)
            { source: 'local', path: './videos/large-video.mp4' },
            // Google Drive file
            { source: 'google-drive', path: './uploads/document.pdf' },
            // AWS S3 file
            { source: 'aws-s3', path: './backups/database.zip' },
            // URL file
            { source: 'url', url: 'https://example.com/public-document.pdf' },
        ]);
    }
    catch (error) {
        console.error('Example 2 failed:', error);
    }
}
/**
 * Example 3: Send email with uploaded files (simulating form upload)
 */
async function exampleUploadedFiles() {
    console.log('📧 Example 3: Sending email with uploaded files...');
    try {
        // Simulate uploaded files from form data
        const uploadedFiles = [
            {
                buffer: Buffer.from('This is a test file content'),
                originalname: 'test.txt',
                mimetype: 'text/plain',
            },
            {
                buffer: Buffer.from('PDF content simulation'),
                originalname: 'document.pdf',
                mimetype: 'application/pdf',
            },
        ];
        await (0, sendEmailWithAttachments_1.sendEmailWithAttachments)({
            to: 'recipient@example.com',
            subject: 'Uploaded Files Example',
            text: 'Files uploaded through web form.',
            attachments: uploadedFiles.map(file => ({
                source: 'upload',
                content: file.buffer,
                name: file.originalname,
                type: file.mimetype,
            })),
        });
    }
    catch (error) {
        console.error('Example 3 failed:', error);
    }
}
/**
 * Example 4: Send email with buffer files
 */
async function exampleBufferFiles() {
    console.log('📧 Example 4: Sending email with buffer files...');
    try {
        await (0, sendEmailWithAttachments_1.sendEmailWithAttachments)({
            to: 'recipient@example.com',
            subject: 'Buffer Files Example',
            text: 'Files created from memory buffers.',
            attachments: [
                {
                    source: 'buffer',
                    content: Buffer.from('Generated content from memory'),
                    name: 'generated-file.txt',
                    type: 'text/plain',
                },
                {
                    source: 'buffer',
                    content: Buffer.from('Another generated file'),
                    name: 'data.csv',
                    type: 'text/csv',
                },
            ],
        });
    }
    catch (error) {
        console.error('Example 4 failed:', error);
    }
}
/**
 * Example 5: Send email with URLs only
 */
async function exampleUrlFiles() {
    console.log('📧 Example 5: Sending email with URL files...');
    try {
        await (0, sendEmailWithAttachments_1.sendEmailWithAttachments)({
            to: 'recipient@example.com',
            subject: 'URL Files Example',
            text: 'Files downloaded from URLs.',
            attachments: [
                { source: 'url', url: 'https://example.com/file1.pdf' },
                { source: 'url', url: 'https://example.com/file2.zip' },
                { source: 'url', url: 'https://example.com/image.jpg' },
            ],
        });
    }
    catch (error) {
        console.error('Example 5 failed:', error);
    }
}
/**
 * Example 6: Send email with large files (automatic Google Drive upload)
 */
async function exampleLargeFiles() {
    console.log('📧 Example 6: Sending email with large files...');
    try {
        await (0, sendEmailWithAttachments_1.sendEmailWithAttachments)({
            to: 'recipient@example.com',
            subject: 'Large Files Example',
            text: 'Large files will be automatically uploaded to Google Drive.',
            attachments: [
                { source: 'local', path: './videos/large-video.mp4' },
                { source: 'local', path: './backups/database-backup.zip' },
                { source: 'local', path: './documents/large-report.pdf' },
            ],
        });
    }
    catch (error) {
        console.error('Example 6 failed:', error);
    }
}
/**
 * Example 7: Send email with AWS S3 files
 */
async function exampleS3Files() {
    console.log('📧 Example 7: Sending email with S3 files...');
    try {
        await (0, sendEmailWithAttachments_1.sendEmailWithAttachments)({
            to: 'recipient@example.com',
            subject: 'S3 Files Example',
            text: 'Files from AWS S3.',
            attachments: [
                { source: 'aws-s3', path: 'documents/report.pdf' },
                { source: 'aws-s3', path: 'images/logo.png' },
                { source: 'aws-s3', path: 'data/export.csv' },
            ],
        });
    }
    catch (error) {
        console.error('Example 7 failed:', error);
    }
}
/**
 * Example 8: Process attachments without sending email
 */
async function exampleProcessOnly() {
    console.log('📧 Example 8: Processing attachments only...');
    try {
        const attachments = [
            { source: 'local', path: './documents/small.pdf' },
            { source: 'local', path: './videos/large.mp4' },
            { source: 'url', url: 'https://example.com/file.pdf' },
        ];
        console.log('Processing attachments...');
        const processedAttachments = await fileAttachmentManager_1.default.processAttachments(attachments);
        console.log('\n📊 Processing Results:');
        processedAttachments.forEach((attachment, index) => {
            if (attachment.success) {
                console.log(`${index + 1}. ✅ ${attachment.source}: ${attachment.data.filename || attachment.data.url}`);
            }
            else {
                console.log(`${index + 1}. ❌ ${attachment.source}: ${attachment.error}`);
            }
        });
        const emailFormat = fileAttachmentManager_1.default.convertToEmailFormat(processedAttachments);
        console.log('\n📧 Email Format:');
        console.log(`- Attachments: ${emailFormat.attachments.length}`);
        console.log(`- Drive Links: ${emailFormat.driveLinks.length}`);
        console.log(`- S3 Links: ${emailFormat.s3Links.length}`);
        console.log(`- URL Links: ${emailFormat.urlLinks.length}`);
    }
    catch (error) {
        console.error('Example 8 failed:', error);
    }
}
/**
 * Run all examples
 */
async function runAllExamples() {
    console.log('🚀 Running all attachment examples...\n');
    const examples = [
        { name: 'Local Files', func: exampleLocalFiles },
        { name: 'Mixed Sources', func: exampleMixedSources },
        { name: 'Uploaded Files', func: exampleUploadedFiles },
        { name: 'Buffer Files', func: exampleBufferFiles },
        { name: 'URL Files', func: exampleUrlFiles },
        { name: 'Large Files', func: exampleLargeFiles },
        { name: 'S3 Files', func: exampleS3Files },
        { name: 'Process Only', func: exampleProcessOnly },
    ];
    for (let i = 0; i < examples.length; i++) {
        const example = examples[i];
        if (!example)
            continue;
        console.log(`\n${'='.repeat(50)}`);
        console.log(`Example ${i + 1}: ${example.name}`);
        console.log(`${'='.repeat(50)}`);
        try {
            await example.func();
            console.log(`✅ Example ${i + 1} completed successfully`);
        }
        catch (error) {
            console.error(`❌ Example ${i + 1} failed:`, error.message);
        }
        // Wait a bit between examples
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('\n🎉 All examples completed!');
}
// If this file is run directly
if (require.main === module) {
    console.log('📧 Attachment Examples');
    console.log('Usage: node attachmentExamples.js [example_number]');
    console.log('\nAvailable examples:');
    console.log('1. Local Files');
    console.log('2. Mixed Sources');
    console.log('3. Uploaded Files');
    console.log('4. Buffer Files');
    console.log('5. URL Files');
    console.log('6. Large Files');
    console.log('7. S3 Files');
    console.log('8. Process Only');
    console.log('all. Run all examples');
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('\nRunning all examples...');
        runAllExamples().catch(console.error);
    }
    else {
        const exampleNumberStr = args[0];
        const examples = [
            exampleLocalFiles,
            exampleMixedSources,
            exampleUploadedFiles,
            exampleBufferFiles,
            exampleUrlFiles,
            exampleLargeFiles,
            exampleS3Files,
            exampleProcessOnly,
        ];
        if (exampleNumberStr === 'all') {
            runAllExamples().catch(console.error);
        }
        else {
            const exampleNumber = Number(exampleNumberStr);
            if (!isNaN(exampleNumber) &&
                exampleNumber >= 1 &&
                exampleNumber <= examples.length) {
                const exampleIndex = exampleNumber - 1;
                const exampleFunc = examples[exampleIndex];
                if (typeof exampleFunc === 'function') {
                    console.log(`\nRunning example ${exampleNumber}...`);
                    exampleFunc().catch(console.error);
                }
                else {
                    console.error('❌ Example function is not defined.');
                    process.exit(1);
                }
            }
            else {
                console.error('❌ Invalid example number. Please choose 1-8 or "all".');
                process.exit(1);
            }
        }
    }
}
//# sourceMappingURL=attachmentExamples.js.map