module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  verbose: true,
  testTimeout: 10000
}; 