/**
 * Cryptographic Validation Tests for Ethereum Paper Wallet
 * 
 * These tests verify:
 * 1. That the mnemonic generated is a valid mnemonic for the private key
 * 2. That the public address corresponds with the private key that was generated
 */

// Import ethers.js directly for validation
const ethers = require('ethers');

// Import the wallet.js file directly
const fs = require('fs');
const path = require('path');
const walletJsPath = path.join(__dirname, '../../js/wallet.js');
const walletJs = fs.readFileSync(walletJsPath, 'utf8');

// Create a function to execute the wallet.js code in the current scope
function loadWalletJs() {
  // Create a new Function to execute the wallet.js code
  const walletJsFunction = new Function('global', `
    const window = global;
    const document = global.document;
    const ethers = global.ethers;
    const PrintHandler = global.PrintHandler;
    
    // Suppress console.log during tests
    const originalConsoleLog = console.log;
    console.log = function() {}; // No-op function instead of jest.fn()
    
    ${walletJs}
    
    // Restore console.log after module is loaded
    console.log = originalConsoleLog;
    
    return { WalletGenerator };
  `);
  
  // Execute the function with the global object as context
  return walletJsFunction(global);
}

// Mock PrintHandler
global.PrintHandler = {
  renderWallet: jest.fn()
};

// Mock ethers but keep the original implementation for validation
global.ethers = {
  Wallet: {
    createRandom: jest.fn().mockImplementation(() => {
      // Use actual ethers.js to create a wallet, which allows us to validate properly
      const realWallet = ethers.Wallet.createRandom();
      return {
        address: realWallet.address,
        privateKey: realWallet.privateKey,
        mnemonic: {
          phrase: realWallet.mnemonic.phrase
        },
        _realWallet: realWallet // Keep a reference to the real wallet for validation
      };
    })
  }
};

describe('Wallet Cryptographic Validation', () => {
  let WalletGenerator;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Load the wallet.js module
    const result = loadWalletJs();
    WalletGenerator = result.WalletGenerator;
  });
  
  describe('Cryptographic Relationships', () => {
    it('should generate a mnemonic that corresponds to the private key', () => {
      // Generate a wallet using the WalletGenerator
      const wallet = WalletGenerator.generateWallet();
      
      // Retrieve the real wallet instance from our mock
      const realWalletFromMock = global.ethers.Wallet.createRandom.mock.results[0].value._realWallet;
      
      // Create a new wallet from the mnemonic to verify it produces the same private key
      const walletFromMnemonic = ethers.Wallet.fromMnemonic(wallet.mnemonic);
      
      // Verify the mnemonic generates the same private key
      expect(walletFromMnemonic.privateKey).toBe(wallet.privateKey);
      
      // Double check using the real wallet from our mock
      expect(realWalletFromMock.privateKey).toBe(wallet.privateKey);
    });
    
    it('should generate a public address that corresponds to the private key', () => {
      // Generate a wallet using the WalletGenerator
      const wallet = WalletGenerator.generateWallet();
      
      // Create a new wallet from the private key
      const walletFromPrivateKey = new ethers.Wallet(wallet.privateKey);
      
      // Verify the private key generates the same address
      expect(walletFromPrivateKey.address.toLowerCase()).toBe(wallet.address.toLowerCase());
      
      // Retrieve the real wallet instance from our mock
      const realWalletFromMock = global.ethers.Wallet.createRandom.mock.results[0].value._realWallet;
      
      // Double check using the real wallet from our mock
      expect(realWalletFromMock.address.toLowerCase()).toBe(wallet.address.toLowerCase());
    });
  });
}); 