'use strict';

/**
 * Print Module
 * 
 * This module handles the rendering and printing of a single paper wallet.
 */

const PrintHandler = (() => {
    // DOM elements
    let walletContainer;
    let printButton;
    
    /**
     * Initialize the print handler
     */
    function init() {
        walletContainer = document.getElementById('wallet-container');
        printButton = document.getElementById('print-wallet');
        
        // Set up print button handler
        if (printButton) {
            printButton.addEventListener('click', printWallet);
        }
    }
    
    /**
     * Create QR code for address
     * @param {string} value - The string to encode in the QR code
     * @param {HTMLElement} container - The container element for the QR code
     */
    function createQRCode(value, container) {
        try {
            // Clear the container
            container.innerHTML = '';
            
            // Create a new QR code
            new QRCode(container, {
                text: value,
                width: 150,
                height: 150,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // Remove any unwanted styles from the QR code image
            const img = container.querySelector('img');
            if (img) {
                img.style.border = 'none';
                img.style.boxShadow = 'none';
                img.style.outline = 'none';
            }
        } catch (error) {
            console.error('Error creating QR code:', error);
            container.innerHTML = '<div class="qr-error">Error generating QR code</div>';
        }
    }
    
    /**
     * Render wallet details in the preview section
     * @param {Object} wallet - The wallet object to render
     */
    function renderWallet(wallet) {
        if (!wallet) {
            console.error("No wallet provided to render");
            return;
        }
        
        try {
            // Get references to elements
            const walletPreview = document.getElementById('wallet-preview');
            walletContainer.innerHTML = ''; // Clear previous wallet
            
            // Create paper wallet element
            const paperWallet = document.createElement('div');
            paperWallet.className = 'paper-wallet';
            
            // Create header
            const walletHeader = document.createElement('div');
            walletHeader.className = 'wallet-header';
            
            // Add receiver name if provided
            let headerContent = `<h3>Ethereum Paper Wallet</h3>`;
            if (wallet.receiverName) {
                headerContent += `<div class="receiver-name">For: ${wallet.receiverName}</div>`;
            }
            walletHeader.innerHTML = headerContent;
            
            // Create public section
            const walletPublic = document.createElement('div');
            walletPublic.className = 'wallet-public';
            walletPublic.innerHTML = `
                <h4>Public Address</h4>
                <div class="qr-container" id="public-qr"></div>
                <div class="address-container">${wallet.address}</div>
            `;
            
            // Create private section (without QR code)
            const walletPrivate = document.createElement('div');
            walletPrivate.className = 'wallet-private';
            walletPrivate.innerHTML = `
                <div class="private-warning">KEEP PRIVATE - DO NOT SHARE</div>
                <div class="key-section">
                    <h4>Private Key</h4>
                    <div class="key-container">${wallet.privateKey}</div>
                </div>
                <div class="mnemonic-section">
                    <h4>Recovery Phrase</h4>
                    <div class="mnemonic-container">${wallet.mnemonic}</div>
                </div>
            `;
            
            // Create compact instructions with safety precautions
            const walletInstructions = document.createElement('div');
            walletInstructions.className = 'wallet-instructions';
            walletInstructions.innerHTML = `
                <h4>Wallet Instructions & Safety Precautions</h4>
                
                <div class="instruction-grid">
                    <div class="instruction-section">
                        <h5>What This Contains:</h5>
                        <ul>
                            <li><strong>Public:</strong> Share to receive funds</li>
                            <li><strong>Private:</strong> Controls funds</li>
                            <li><strong>Recovery:</strong> Backup method</li>
                        </ul>
                    </div>
                    
                    <div class="instruction-section">
                        <h5>Security Tips:</h5>
                        <ul>
                            <li>Store securely & waterproof</li>
                            <li>Never share private data</li>
                            <li>No digital copies/photos</li>
                        </ul>
                    </div>
                    
                    <div class="instruction-section">
                        <h5>Using Wallet:</h5>
                        <ul>
                            <li>Check: Use explorer</li>
                            <li>Receive: Share public address</li>
                            <li>Spend: Import to wallet app</li>
                        </ul>
                    </div>
                </div>
                
                <div class="security-warning">
                    Anyone with your private key can access your funds. Treat this document like cash.
                </div>
            `;
            
            // Assemble paper wallet
            paperWallet.appendChild(walletHeader);
            paperWallet.appendChild(walletPublic);
            paperWallet.appendChild(walletPrivate);
            paperWallet.appendChild(walletInstructions);
            
            // Add paper wallet to container
            walletContainer.appendChild(paperWallet);
            
            // Show wallet preview section
            walletPreview.classList.remove('hidden');
            
            // Generate QR code for public address
            createQRCode(wallet.address, document.getElementById('public-qr'));
        } catch (error) {
            console.error('Error rendering wallet:', error);
            alert('Error rendering wallet: ' + error.message);
        }
    }
    
    /**
     * Print the wallet
     */
    function printWallet() {
        const wallet = WalletGenerator.getGeneratedWallet();
        
        if (!wallet) {
            alert('Please generate a wallet first.');
            return;
        }
        
        try {
            // Get the original wallet element and print container
            const walletContainer = document.getElementById('wallet-container');
            const printContainer = document.getElementById('print-container');
            
            if (!walletContainer || !printContainer) {
                console.error('Required elements not found');
                return;
            }
            
            // Clear the print container
            printContainer.innerHTML = '';
            
            // Clone the wallet content for printing
            const paperWallet = walletContainer.querySelector('.paper-wallet');
            if (paperWallet) {
                const clone = paperWallet.cloneNode(true);
                printContainer.appendChild(clone);
                
                // Set original title
                const originalTitle = document.title;
                document.title = 'Ethereum Paper Wallet';
                
                // Make sure QR code is properly cloned
                const publicQR = printContainer.querySelector('#public-qr');
                if (publicQR && publicQR.children.length === 0 && wallet.address) {
                    createQRCode(wallet.address, publicQR);
                }
                
                // Print the document
                window.print();
                
                // Restore title
                document.title = originalTitle;
            } else {
                alert('No wallet content found to print');
            }
        } catch (error) {
            console.error('Error printing wallet:', error);
            alert('Error printing wallet: ' + error.message);
        }
    }
    
    // Public API
    return {
        init,
        renderWallet,
        printWallet
    };
})();

// Initialize the print handler when the DOM is ready
document.addEventListener('DOMContentLoaded', PrintHandler.init);

// Export functions for external use
window.PrintModule = {
    renderWallet: PrintHandler.renderWallet,
    printWallet: PrintHandler.printWallet
}; 