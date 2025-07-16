"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Test setup file for Jest
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables for tests
dotenv_1.default.config({ path: '.env.test' });
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
//# sourceMappingURL=setup.js.map