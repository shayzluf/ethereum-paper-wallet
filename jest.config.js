module.exports = {
  // Use jsdom environment for browser-like testing
  testEnvironment: 'jsdom',
  
  // Directories to ignore during testing
  testPathIgnorePatterns: ['/node_modules/'],
  
  // Setup files to run before each test
  setupFiles: ['<rootDir>/tests/setup.js'],
  
  // Verbose output
  verbose: true
}; 