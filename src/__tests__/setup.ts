// Test setup file for Jest
import dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config({ path: '.env.test' });

// Global test configuration
beforeAll(() => {
  // Setup any global test configuration
  console.log('Setting up test environment...');
});

afterAll(() => {
  // Cleanup after all tests
  console.log('Cleaning up test environment...');
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
