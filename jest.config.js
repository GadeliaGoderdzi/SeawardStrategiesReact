module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.js'],

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  // Transform files
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-css',
    '^(?!.*\\.(js|jsx|css|json)$)': 'jest-transform-file'
  },

  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@components/(.*)$': '<rootDir>/client/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/client/src/pages/$1',
    '^@hooks/(.*)$': '<rootDir>/client/src/hooks/$1',
    '^@services/(.*)$': '<rootDir>/client/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/client/src/utils/$1',
    '^@styles/(.*)$': '<rootDir>/client/src/styles/$1'
  },

  // Test match patterns
  testMatch: [
    '<rootDir>/client/src/**/__tests__/**/*.(js|jsx)',
    '<rootDir>/client/src/**/?(*.)(test|spec).(js|jsx)',
    '<rootDir>/server/src/**/__tests__/**/*.(js|jsx)',
    '<rootDir>/server/src/**/?(*.)(test|spec).(js|jsx)'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/client/build/',
    '<rootDir>/server/build/'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'client/src/**/*.{js,jsx}',
    'server/src/**/*.{js,jsx}',
    '!client/src/index.js',
    '!client/src/serviceWorker.js',
    '!**/node_modules/**',
    '!**/build/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Global setup and teardown
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js',

  // Test timeout
  testTimeout: 10000,

  // Error on deprecated features
  errorOnDeprecated: true
};
