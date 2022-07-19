const config = require('./jest.config');

// Integration tests use the suffix .integrationTest.js
config.testMatch = [
  '**/?(*.)+(integrationTest).[tj]s'
];
config.globalTeardown = '<rootDir>/test/integration/teardown.js';
config.globalSetup = '<rootDir>/test/integration/setup.js';

module.exports = config;
