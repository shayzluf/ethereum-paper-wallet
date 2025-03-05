'use strict';

/**
 * Main Application Module
 * 
 * This module initializes the application and coordinates all other modules.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    console.log('Initializing Ethereum Paper Wallet Generator');
    
    // Set up event listeners
    setupEventListeners();
    
    // Setup a warning when leaving the page
    setupPageLeaveWarning();
    
    // Setup download link for offline use
    setupOfflineDownload();
}

/**
 * Set up event listeners for the application
 */
function setupEventListeners() {
    // Generate wallet button
    const generateButton = document.getElementById('generate-wallet');
    generateButton.addEventListener('click', generateWallet);
    
    // Regenerate wallet button
    const regenerateButton = document.getElementById('regenerate-wallet');
    regenerateButton.addEventListener('click', resetApplication);
    
    // GitHub link
    const githubLink = document.getElementById('github-link');
    if (githubLink) {
        githubLink.href = 'https://github.com/shayzluf/ethereum-paper-wallet';
    }

    // Set up GitHub link
    document.getElementById('github-link').addEventListener('click', function(event) {
        event.preventDefault();
        window.open('https://github.com/shayzluf/ethereum-paper-wallet', '_blank');
    });
}

/**
 * Generate a wallet using the browser's secure random number generator
 */
function generateWallet() {
    try {
        // Generate wallet using browser's secure random number generator
        const wallet = WalletGenerator.generateWallet();
        
        // Scroll to the wallet preview
        document.getElementById('wallet-preview').scrollIntoView({ behavior: 'smooth' });
        
        console.log('Wallet generated successfully');
    } catch (error) {
        console.error('Error generating wallet:', error);
        alert(`Error generating wallet: ${error.message}`);
    }
}

/**
 * Reset the application for generating a new wallet
 */
function resetApplication() {
    // Clear existing wallet
    WalletGenerator.clearWallet();
    
    // Clear receiver name input
    const receiverNameInput = document.getElementById('receiver-name');
    if (receiverNameInput) {
        receiverNameInput.value = '';
    }
    
    // Hide wallet preview
    document.getElementById('wallet-preview').classList.add('hidden');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    console.log('Application reset for new wallet generation');
}

/**
 * Set up a warning when leaving the page if a wallet has been generated
 */
function setupPageLeaveWarning() {
    window.addEventListener('beforeunload', (event) => {
        // Check if a wallet has been generated
        const generatedWallet = WalletGenerator.getGeneratedWallet();
        
        if (generatedWallet) {
            // Display warning
            const message = 'Warning: You have generated a wallet that will be lost if you leave or reload this page.';
            event.returnValue = message;
            return message;
        }
    });
}

/**
 * Set up download link for offline use
 */
function setupOfflineDownload() {
    const downloadLink = document.getElementById('download-html');
    
    if (downloadLink) {
        // The href is already set in the HTML to point directly to the ZIP file
        
        // Add click handler to show instructions after click
        downloadLink.addEventListener('click', (event) => {
            // Don't prevent default - let the browser handle the actual download
            
            // Show instructions in a setTimeout to allow the download to start first
            setTimeout(() => {
                alert('Downloading the complete repository for offline use.\n\nFor maximum security:\n1. Extract the zip file after download\n2. Disconnect from the internet\n3. Open the index.html file in your browser\n4. Generate and print your wallet\n5. Close the browser when done');
            }, 100);
        });
    }
} 