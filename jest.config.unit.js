const config = require('./jest.config');

// Integration tests use the suffix .integrationTest.js
config.testMatch = [
  '**/__tests__/**/*.[jt]s?(x)',
  '**/?(*.)+(spec|test).[tj]s?(x)'
];
config.globalTeardown = undefined;

module.exports = config;
