# Encryption Helper Utility

## Overview
A common encryption utility class that provides standardized methods for generating short, encrypted codes across multiple APIs. This utility ensures consistency and reusability for all encryption needs in the application.

## Features
- **Standardized Code Generation**: Consistent 8-character codes across all APIs
- **Multiple Use Cases**: Pre-built methods for offers, transactions, leads, complaints, and products
- **Configurable Length**: Customizable code length for different requirements
- **Error Handling**: Comprehensive error handling with descriptive messages
- **Security**: Uses HMAC-SHA256 with configurable secret keys

## Installation
The utility is located at `app/utils/encryptionHelper.js` and can be imported into any controller.

## Basic Usage

### Import the Helper
```javascript
import encryptionHelper from "../../utils/encryptionHelper.js";
```

### Generate Offer Code
```javascript
const encryptedCode = encryptionHelper.generateShortCode({ 
    offer_id: "123", 
    user_id: "456" 
});
// Returns: "A1B2C3D4"
```

### Generate Transaction Code
```javascript
const transactionCode = encryptionHelper.generateTransactionCode({
    transaction_id: "789",
    user_id: "456",
    amount: "100.00"
});
// Returns: "T1X2N3Y4"
```

### Generate Lead Code
```javascript
const leadCode = encryptionHelper.generateLeadCode({
    lead_id: "101",
    user_id: "456",
    vendor_id: "789"
});
// Returns: "L1E2A3D4"
```

### Generate Complaint Code
```javascript
const complaintCode = encryptionHelper.generateComplaintCode({
    complaint_id: "202",
    user_id: "456",
    type: "technical"
});
// Returns: "C1O2M3P4"
```

### Generate Product Code
```javascript
const productCode = encryptionHelper.generateProductCode({
    product_id: "303",
    vendor_id: "789",
    category_id: "404"
});
// Returns: "P1R2O3D4"
```

### Generic Code Generation
```javascript
// For any custom data
const customCode = encryptionHelper.generateGenericCode(
    { custom_field: "value" }, 
    "CUSTOM", 
    6
);
// Returns: "C1U2S3"
```

## Advanced Usage

### Custom Code Length
```javascript
// Generate 12-character code
const longCode = encryptionHelper.generateShortCode(
    { offer_id: "123", user_id: "456" }, 
    12
);
// Returns: "A1B2C3D4E5F6"
```

### Custom Secret Key
```javascript
// Set custom secret key for specific use case
encryptionHelper.setSecretKey("my-custom-secret-key");

// Generate code with custom secret
const customCode = encryptionHelper.generateShortCode({ 
    offer_id: "123", 
    user_id: "456" 
});
```

### Debug Information
```javascript
// Get masked secret key for debugging
const maskedKey = encryptionHelper.getSecretKey();
// Returns: "my-cu******y-key"
```

## API Integration Examples

### In Offers Controller
```javascript
export const generateOfferCode = (req, res) => {
    try {
        const { offer_id } = req.body;
        const user_id = req.user?.id;
        
        // Validate offer...
        
        // Generate encrypted code
        const encryptedCode = encryptionHelper.generateShortCode({ 
            offer_id, 
            user_id 
        });
        
        // Return response...
    } catch (err) {
        // Error handling...
    }
}
```

### In Transaction Controller
```javascript
export const generateTransactionCode = (req, res) => {
    try {
        const { transaction_id, amount } = req.body;
        const user_id = req.user?.id;
        
        // Generate transaction code
        const transactionCode = encryptionHelper.generateTransactionCode({
            transaction_id,
            user_id,
            amount
        });
        
        // Return response...
    } catch (err) {
        // Error handling...
    }
}
```

### In Leads Controller
```javascript
export const generateLeadCode = (req, res) => {
    try {
        const { lead_id, vendor_id } = req.body;
        const user_id = req.user?.id;
        
        // Generate lead code
        const leadCode = encryptionHelper.generateLeadCode({
            lead_id,
            user_id,
            vendor_id
        });
        
        // Return response...
    } catch (err) {
        // Error handling...
    }
}
```

## Environment Configuration
Add to your `.env` file:
```
ENCRYPTION_SECRET=your-super-secret-encryption-key-here
```

## Code Format
All generated codes follow this pattern:
- **Length**: 8 characters by default (configurable)
- **Case**: Uppercase letters and numbers
- **Uniqueness**: Includes timestamp for uniqueness
- **Format**: `A1B2C3D4` (example)

## Security Features
- **HMAC-SHA256**: Cryptographically secure hashing
- **Timestamp Inclusion**: Ensures uniqueness across requests
- **Configurable Secrets**: Environment-based secret key management
- **Data Validation**: Input validation before encryption
- **Error Handling**: Secure error messages without exposing internals

## Best Practices
1. **Always validate input data** before passing to encryption methods
2. **Use appropriate method** for your use case (don't use generic when specific exists)
3. **Handle errors gracefully** - encryption failures should not crash your API
4. **Keep secret keys secure** - never expose them in logs or responses
5. **Use consistent code lengths** across similar features for user experience

## Error Handling
The utility throws descriptive errors that should be caught and handled appropriately:
```javascript
try {
    const code = encryptionHelper.generateShortCode({ offer_id: "123" });
} catch (error) {
    // Handle error: "Encryption failed: user_id is required"
    console.error(error.message);
}
```

## Migration Guide
If you have existing encryption code in other controllers:

1. **Import the helper**: `import encryptionHelper from "../../utils/encryptionHelper.js"`
2. **Replace crypto logic** with appropriate helper method
3. **Update error handling** to catch encryption errors
4. **Test thoroughly** to ensure same output format

## Support
For questions or issues with the encryption helper, refer to the method documentation above or check the source code in `app/utils/encryptionHelper.js`.
