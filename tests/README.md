# Ethereum Paper Wallet Generator Tests

This directory contains tests for the Ethereum Paper Wallet Generator application. The tests focus on validating the cryptographic relationships between the wallet components.

## Test Focus

The tests validate two critical cryptographic relationships:

1. **Mnemonic to Private Key**: Verifies that the mnemonic phrase correctly corresponds to the private key. This ensures that if you need to recover a wallet from the mnemonic phrase, it will generate the same private key.

2. **Private Key to Public Address**: Verifies that the public address is correctly derived from the private key. This ensures that funds sent to the public address can be accessed using the private key.

## Test Structure

```
tests/
├── unit/                 # Unit tests
│   └── wallet.test.js    # Tests for cryptographic validity
└── setup.js              # Jest setup file
```

## Running Tests

To run the tests, you need to have Node.js and npm installed. Then, you can run the following commands:

```bash
# Install dependencies
npm install

# Run tests
npm test
```

## Implementation Details

The tests use the actual ethers.js library to validate the cryptographic relationships:

- We create a wallet using the application's wallet generator
- We then use ethers.js to derive a wallet from the generated mnemonic phrase and verify it matches the original private key
- We also derive a wallet from the private key and verify it matches the original public address

This approach ensures that the application correctly implements the Ethereum cryptographic standards.

## Why This Matters

Proper cryptographic validation is critical for a paper wallet application. If the relationships between mnemonic, private key, and public address are not correctly implemented, users could lose access to their funds or generate wallets that cannot be properly recovered. 