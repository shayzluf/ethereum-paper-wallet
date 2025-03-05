'use strict';

/**
 * Wallet Generation Module
 * 
 * This module handles the secure generation of Ethereum wallets using ethers.js
 * and the browser's built-in cryptographically secure random number generator.
 */

const WalletGenerator = (() => {
    // Private variables
    let generatedWallet = null;
    
    /**
     * Generate a new wallet using browser's secure random number generator
     * @returns {Object} - Wallet object with address, private key, and mnemonic
     */
    function generateSecureWallet() {
        try {
            console.log('Generating wallet using browser crypto...');
            
            // Use ethers.js createRandom which leverages the browser's
            // cryptographically secure random number generator
            const wallet = ethers.Wallet.createRandom();
            
            return {
                address: wallet.address,
                privateKey: wallet.privateKey,
                mnemonic: wallet.mnemonic.phrase
            };
        } catch (error) {
            console.error('Error generating wallet:', error);
            throw new Error('Failed to generate wallet: ' + error.message);
        }
    }
    
    /**
     * Generate a new wallet
     * @returns {Object} - Wallet object
     */
    function generateWallet() {
        try {
            // Get the receiver's name from the input field
            const receiverNameInput = document.getElementById('receiver-name');
            const receiverName = receiverNameInput ? receiverNameInput.value.trim() : '';
            
            // Generate a single wallet using secure random generation
            generatedWallet = generateSecureWallet();
            
            // Add the receiver's name to the wallet object
            generatedWallet.receiverName = receiverName;
            
            // Render the wallet in the UI
            if (typeof PrintHandler !== 'undefined' && PrintHandler.renderWallet) {
                PrintHandler.renderWallet(generatedWallet);
            }
            
            return generatedWallet;
        } catch (error) {
            console.error('Error generating wallet:', error);
            throw new Error('Failed to generate wallet: ' + error.message);
        }
    }
    
    /**
     * Get the generated wallet
     * @returns {Object} - Wallet object
     */
    function getGeneratedWallet() {
        return generatedWallet;
    }
    
    /**
     * Clear the generated wallet from memory
     */
    function clearWallet() {
        generatedWallet = null;
    }
    
    // Public API
    return {
        generateWallet,
        getGeneratedWallet,
        clearWallet
    };
})(); 