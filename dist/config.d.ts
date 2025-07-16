declare const config: {
    gmail: {
        user: string;
        password: string;
        fromAlias: string;
        fromEmail: string;
        smtpHost: string;
        smtpPort: number;
        smtpSecure: boolean;
        defaultTo: string;
    };
    googleDrive: {
        serviceAccountCredentials: string;
        folderId: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
        s3Bucket: string;
        s3BucketUrl: string;
    };
};
export default config;
//# sourceMappingURL=config.d.ts.map