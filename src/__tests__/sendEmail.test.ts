import { sendEmail, sendTestEmail, sendCustomEmail } from '../sendEmail';

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({
      messageId: 'test-message-id',
      response: 'OK',
    }),
  })),
}));

describe('Email Sending Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send an email successfully', async() => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test email',
      };

      const result = await sendEmail(emailOptions);

      expect(result).toBeDefined();
      expect(result.messageId).toBe('test-message-id');
    });

    it('should handle email sending errors', async() => {
      const mockTransporter = require('nodemailer').createTransporter();
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Error'));

      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test email',
      };

      await expect(sendEmail(emailOptions)).rejects.toThrow('SMTP Error');
    });
  });

  describe('sendTestEmail', () => {
    it('should send a test email', async() => {
      await expect(sendTestEmail()).resolves.not.toThrow();
    });
  });

  describe('sendCustomEmail', () => {
    it('should send a custom email', async() => {
      await expect(
        sendCustomEmail('test@example.com', 'Custom Subject', 'Custom content'),
      ).resolves.not.toThrow();
    });
  });
});
