# Google Group Alias Setup Guide

This guide explains how to configure sending emails using Google Group with alias support.

## Overview

Google Groups allows you to send emails from a group address (e.g., support@yourdomain.com) while using your personal Gmail account for authentication.

## Prerequisites

1. A Google Workspace account (formerly G Suite)
2. A Google Group created in your domain
3. Your personal Gmail account with access to the group

## Step-by-Step Setup

### 1. Create a Google Group

1. Go to [Google Groups](https://groups.google.com/)
2. Click "Create group"
3. Fill in the group details:
   - **Name**: Support Team
   - **Group email**: support@yourdomain.com
   - **Description**: Customer support team
4. Set appropriate permissions for posting/sending emails
5. Make sure your sender account (e.g., your-email@yourdomain.com) is a member and has permission to post/send

### 2. Configure Gmail Settings

1. Log in to Gmail with your personal account (e.g., your-email@yourdomain.com)
2. Go to Settings → Accounts and Import
3. In the "Send mail as" section, click "Add another email address"
4. Enter the name and Google Group email (e.g., Support Team <support@yourdomain.com>)
5. Choose "Send through Gmail" (not SMTP)
6. Verify the email address by clicking the verification link sent to the group

### 3. Update Environment Variables

Add these to your `.env.local` file:

```env
# Google Group Configuration
GMAIL_USER=your-email@yourdomain.com
GMAIL_PASSWORD=your_app_password
GMAIL_FROM_ALIAS=Support Team
GMAIL_FROM_EMAIL=support@yourdomain.com
```

### 4. Update Your Code

```typescript
import { sendEmail } from 'cyberscan-google-smtp-email';

const emailConfig = {
  user: 'your-email@yourdomain.com', // your personal account
  password: 'your_app_password',
  fromAlias: 'Support Team',
  fromEmail: 'support@yourdomain.com', // Google Group alias
};

await sendEmail({
  to: 'customer@example.com',
  subject: 'Support Response',
  text: 'Thank you for contacting support.',
  html: '<p>Thank you for contacting support.</p>',
});
```

## Benefits

- **Professional appearance**: Emails appear to come from support@yourdomain.com
- **Team collaboration**: Multiple team members can send from the same address
- **Centralized management**: All support emails go through one group
- **Easy setup**: No complex SMTP configuration required

## Troubleshooting

### "Permission denied" error

- Ensure your personal account is a member of the Google Group
- Check that the group allows posting from members
- Verify the email address in Gmail settings

### "Authentication failed" error

- Use App Passwords, not your regular Gmail password
- Ensure 2-Factor Authentication is enabled
- Check that the App Password has the correct permissions

### "Group not found" error

- Verify the Google Group exists and is active
- Check that you have access to the group
- Ensure the group email address is correct

## Best Practices

1. **Use descriptive group names**: "Support Team" instead of generic names
2. **Set appropriate permissions**: Only allow necessary members to post
3. **Monitor group activity**: Regularly check for spam or inappropriate content
4. **Backup configuration**: Keep a record of your setup for team members
5. **Test thoroughly**: Send test emails to verify everything works correctly
