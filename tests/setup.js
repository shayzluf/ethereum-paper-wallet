// Mock global browser objects and libraries
global.QRCode = class QRCode {
  constructor(element, options) {
    this.element = element;
    this.options = options;
  }
};

// Mock the ethers.js library
global.ethers = {
  Wallet: {
    createRandom: jest.fn().mockImplementation(() => ({
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      privateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      mnemonic: {
        phrase: 'test test test test test test test test test test test test junk'
      }
    }))
  }
};

// Suppress console logs during tests
const originalConsoleLog = console.log;
console.log = function() {};

// Create minimal document elements needed for tests
document.body.innerHTML = `<div id="wallet-container"></div>`;

// Mock minimal DOM features needed for tests
Element.prototype.scrollIntoView = jest.fn();

// Mock window.print for completeness
window.print = jest.fn();

// Mock URL.createObjectURL and URL.revokeObjectURL
URL.createObjectURL = jest.fn().mockReturnValue('blob:test-url');
URL.revokeObjectURL = jest.fn();

// We can't use afterAll here since it's not in scope
// Let's just keep logs suppressed throughout the tests 