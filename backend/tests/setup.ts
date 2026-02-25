import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3002';
process.env.SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';
process.env.SOROBAN_NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
process.env.SOROBAN_CONTRACT_ID = 'test-contract-id';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
