import crypto from "crypto";

class EncryptionHelper {
    constructor() {
        this.secretKey = process.env.ENCRYPTION_SECRET || 'default-secret-key';
    }

    /**
     * Generate a short encrypted code
     * @param {Object} data - Data to encrypt
     * @param {string} data.offer_id - Offer ID
     * @param {string} data.user_id - User ID
     * @param {number} length - Length of the generated code (default: 8)
     * @returns {string} - Short encrypted code
     */
    generateShortCode(data, length = 8) {
        try {
            const { offer_id, user_id } = data;
            
            if (!offer_id || !user_id) {
                throw new Error('offer_id and user_id are required');
            }

            const dataToEncrypt = `${offer_id}:${user_id}:${Date.now()}`;
            
            const fullHash = crypto
                .createHmac('sha256', this.secretKey)
                .update(dataToEncrypt)
                .digest('hex');
            
            // Take first N characters for a shorter, readable code
            return fullHash.substring(0, length).toUpperCase();
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    /**
     * Generate a short encrypted code for any type of data
     * @param {Object} data - Data to encrypt
     * @param {string} prefix - Optional prefix for the data
     * @param {number} length - Length of the generated code (default: 8)
     * @returns {string} - Short encrypted code
     */
    generateGenericCode(data, prefix = '', length = 8) {
        try {
            const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
            const dataToEncrypt = `${prefix}:${dataString}:${Date.now()}`;
            
            const fullHash = crypto
                .createHmac('sha256', this.secretKey)
                .update(dataToEncrypt)
                .digest('hex');
            
            return fullHash.substring(0, length).toUpperCase();
        } catch (error) {
            throw new Error(`Generic encryption failed: ${error.message}`);
        }
    }

    /**
     * Generate a short encrypted code for transactions
     * @param {Object} data - Transaction data
     * @param {number} length - Length of the generated code (default: 8)
     * @returns {string} - Short encrypted code
     */
    generateTransactionCode(data, length = 8) {
        try {
            const { transaction_id, user_id, amount } = data;
            
            if (!transaction_id || !user_id || !amount) {
                throw new Error('transaction_id, user_id, and amount are required');
            }

            const dataToEncrypt = `TXN:${transaction_id}:${user_id}:${amount}:${Date.now()}`;
            
            const fullHash = crypto
                .createHmac('sha256', this.secretKey)
                .update(dataToEncrypt)
                .digest('hex');
            
            return fullHash.substring(0, length).toUpperCase();
        } catch (error) {
            throw new Error(`Transaction code generation failed: ${error.message}`);
        }
    }

    /**
     * Generate a short encrypted code for leads
     * @param {Object} data - Lead data
     * @param {number} length - Length of the generated code (default: 8)
     * @returns {string} - Short encrypted code
     */
    generateLeadCode(data, length = 8) {
        try {
            const { lead_id, user_id, vendor_id } = data;
            
            if (!lead_id || !user_id || !vendor_id) {
                throw new Error('lead_id, user_id, and vendor_id are required');
            }

            const dataToEncrypt = `LEAD:${lead_id}:${user_id}:${vendor_id}:${Date.now()}`;
            
            const fullHash = crypto
                .createHmac('sha256', this.secretKey)
                .update(dataToEncrypt)
                .digest('hex');
            
            return fullHash.substring(0, length).toUpperCase();
        } catch (error) {
            throw new Error(`Lead code generation failed: ${error.message}`);
        }
    }

    /**
     * Generate a short encrypted code for complaints
     * @param {Object} data - Complaint data
     * @param {number} length - Length of the generated code (default: 8)
     * @returns {string} - Short encrypted code
     */
    generateComplaintCode(data, length = 8) {
        try {
            const { complaint_id, user_id, type } = data;
            
            if (!complaint_id || !user_id || !type) {
                throw new Error('complaint_id, user_id, and type are required');
            }

            const dataToEncrypt = `COMP:${complaint_id}:${user_id}:${type}:${Date.now()}`;
            
            const fullHash = crypto
                .createHmac('sha256', this.secretKey)
                .update(dataToEncrypt)
                .digest('hex');
            
            return fullHash.substring(0, length).toUpperCase();
        } catch (error) {
            throw new Error(`Complaint code generation failed: ${error.message}`);
        }
    }

    /**
     * Generate a short encrypted code for products
     * @param {Object} data - Product data
     * @param {number} length - Length of the generated code (default: 8)
     * @returns {string} - Short encrypted code
     */
    generateProductCode(data, length = 8) {
        try {
            const { product_id, vendor_id, category_id } = data;
            
            if (!product_id || !vendor_id || !category_id) {
                throw new Error('product_id, vendor_id, and category_id are required');
            }

            const dataToEncrypt = `PROD:${product_id}:${vendor_id}:${category_id}:${Date.now()}`;
            
            const fullHash = crypto
                .createHmac('sha256', this.secretKey)
                .update(dataToEncrypt)
                .digest('hex');
            
            return fullHash.substring(0, length).toUpperCase();
        } catch (error) {
            throw new Error(`Product code generation failed: ${error.message}`);
        }
    }

    /**
     * Decrypt a short encrypted code to extract offer_id and user_id
     * @param {string} encryptedCode - The encrypted code to decrypt
     * @returns {Object} - Object containing offer_id and user_id
     */
    decryptShortCode(encryptedCode) {
        try {
            if (!encryptedCode || typeof encryptedCode !== 'string') {
                throw new Error('Invalid encrypted code provided');
            }

            // Since we're using HMAC (one-way hash), we can't directly decrypt
            // Instead, we need to store the mapping or use a different approach
            // For now, we'll use a simple base64-like approach for demonstration
            // In production, you might want to use a reversible encryption method
            
            // This is a simplified approach - in real implementation, you'd need to store
            // the mapping between codes and data, or use reversible encryption
            throw new Error('Direct decryption not supported with HMAC. Use stored mapping or reversible encryption.');
            
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    /**
     * Generate a reversible encrypted code for offers
     * @param {Object} data - Data to encrypt
     * @param {string} data.offer_id - Offer ID
     * @param {string} data.user_id - User ID
     * @returns {string} - Encrypted code that can be decrypted
     */
    generateReversibleOfferCode(data) {
        try {
            const { offer_id, user_id } = data;
            
            if (!offer_id || !user_id) {
                throw new Error('offer_id and user_id are required');
            }

            // Create a simple reversible encryption using base64 and a separator
            const dataString = `${offer_id}:${user_id}`;
            const encrypted = Buffer.from(dataString).toString('base64');
            
            // Add a simple checksum for validation
            const checksum = this.generateChecksum(dataString);
            
            return `${encrypted}.${checksum}`;
        } catch (error) {
            throw new Error(`Reversible encryption failed: ${error.message}`);
        }
    }

    /**
     * Decrypt a reversible offer code
     * @param {string} encryptedCode - The encrypted code to decrypt
     * @returns {Object} - Object containing offer_id and user_id
     */
    decryptReversibleOfferCode(encryptedCode) {
        try {
            if (!encryptedCode || typeof encryptedCode !== 'string') {
                throw new Error('Invalid encrypted code provided');
            }

            // Split the code and checksum
            const parts = encryptedCode.split('.');
            if (parts.length !== 2) {
                throw new Error('Invalid code format');
            }

            const [encrypted, checksum] = parts;
            
            // Decode the base64 string
            const decoded = Buffer.from(encrypted, 'base64').toString('utf8');
            
            // Validate checksum
            const expectedChecksum = this.generateChecksum(decoded);
            if (checksum !== expectedChecksum) {
                throw new Error('Invalid checksum - code may be corrupted');
            }

            // Split the decoded string to get offer_id and user_id
            const [offer_id, user_id] = decoded.split(':');
            
            if (!offer_id || !user_id) {
                throw new Error('Invalid code format - missing offer_id or user_id');
            }

            return { offer_id, user_id };
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    /**
     * Generate a simple checksum for validation
     * @param {string} data - Data to generate checksum for
     * @returns {string} - Checksum string
     */
    generateChecksum(data) {
        const hash = crypto
            .createHmac('sha256', this.secretKey)
            .update(data)
            .digest('hex');
        return hash.substring(0, 8);
    }

    /**
     * Set custom secret key
     * @param {string} secretKey - New secret key
     */
    setSecretKey(secretKey) {
        if (secretKey && typeof secretKey === 'string') {
            this.secretKey = secretKey;
        }
    }

    /**
     * Get current secret key (for debugging purposes)
     * @returns {string} - Current secret key (masked)
     */
    getSecretKey() {
        if (this.secretKey.length <= 8) {
            return '*'.repeat(this.secretKey.length);
        }
        return this.secretKey.substring(0, 4) + '*'.repeat(this.secretKey.length - 8) + this.secretKey.substring(this.secretKey.length - 4);
    }
}

// Create and export a singleton instance
const encryptionHelper = new EncryptionHelper();
export default encryptionHelper;
