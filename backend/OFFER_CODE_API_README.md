# Offer Code Generation API

## Overview
This API endpoint allows members to generate encrypted codes for valid offers. The system validates the offer's validity and generates a unique encrypted code using the offer ID and user ID.

## Endpoint
```
POST /api/member/generate_offer_code
```

## Authentication
Requires member authentication middleware (`memberAuth`)

## Request Body
```json
{
  "offer_id": "123",
  "user_id": "456"
}
```

## Response Format

### Success Response (200)
```json
{
  "error": [],
  "result": {
    "message": "Offer code generated successfully",
    "status": 1,
    "data": {
      "offer_id": "123",
      "user_id": "456",
      "encrypted_code": "a1b2c3d4e5f6...",
      "offer_details": {
        // Full offer object from database
      }
    }
  }
}
```

### Error Responses

#### Missing Parameters (400)
```json
{
  "status": 0,
  "message": "offer_id and user_id are required",
  "error": "Missing required parameters"
}
```

#### Invalid/Expired Offer (400)
```json
{
  "status": 0,
  "message": "Invalid or expired offer",
  "error": "Offer not found or not valid"
}
```

#### Server Error (500)
```json
{
  "status": 0,
  "message": "Server error",
  "error": "Error details"
}
```

## Offer Validation Rules
The API checks the following conditions before generating a code:
1. Offer exists in the database
2. Offer status is 'active'
3. Current date is within the offer's validity period (if start_date and end_date are set)

## Encryption Details
- Uses HMAC-SHA256 algorithm
- Combines offer_id, user_id, and current timestamp
- Generates a short 8-character uppercase code for easy reading
- Requires `ENCRYPTION_SECRET` environment variable
- Falls back to default secret if environment variable is not set

## Environment Variables
Add the following to your `.env` file:
```
ENCRYPTION_SECRET=your-super-secret-encryption-key-here
```

## Database Requirements
The `offers` table should have the following columns:
- `id` - Primary key
- `status` - Offer status (should be 'active' for valid offers)
- `start_date` - Optional start date for the offer
- `end_date` - Optional end date for the offer

## Security Notes
- The encrypted code is unique for each request due to timestamp inclusion
- Uses HMAC for secure hashing
- Requires authentication to prevent unauthorized access
- Validates offer existence and status before code generation

---

# Offer Code Validation API

## Overview
This API endpoint allows members and vendors to validate encrypted offer codes. The system decrypts the code to extract the offer ID and user ID, then validates the offer's current status and validity.

## Endpoints
```
POST /api/member/offers_validity_check
POST /api/vendor/offers_validity_check
```

## Authentication
- Member endpoint requires member authentication middleware (`memberAuth`)
- Vendor endpoint requires vendor authentication middleware (`vendorAuth`)

## Request Body
```json
{
  "offer_code": "encrypted_offer_code_here"
}
```

## Response Format

### Success Response (200)
```json
{
  "error": [],
  "result": {
    "message": "Offer code is valid",
    "status": 1,
    "data": {
      "offer_id": "123",
      "user_id": "456",
      "offer_title": "Special Discount",
      "offer_description": "Get 20% off on all products",
      "discount": "20",
      "discount_code": "SAVE20",
      "vendor_name": "ABC Store",
      "start_date": "2024-01-01",
      "end_date": "2024-12-31",
      "is_valid": true
    }
  }
}
```

### Error Responses

#### Missing Parameters (400)
```json
{
  "status": 0,
  "message": "offer_code is required",
  "error": "Missing required parameter"
}
```

#### Invalid Offer Code (400)
```json
{
  "status": 0,
  "message": "Invalid offer code",
  "error": "Decryption failed: Invalid code format"
}
```

#### Invalid/Expired Offer (400)
```json
{
  "status": 0,
  "message": "Invalid or expired offer",
  "error": "Offer not found, inactive, or expired"
}
```

#### Server Error (500)
```json
{
  "status": 0,
  "message": "Server error",
  "error": "Error details"
}
```

## Validation Rules
The API checks the following conditions:
1. Offer code can be successfully decrypted
2. Offer exists in the database
3. Offer status is active ('1')
4. Current date is within the offer's validity period
5. For vendors: offer belongs to the authenticated vendor
6. For members: offer code was generated for the authenticated user (optional)

## Encryption Details
- Uses reversible encryption with base64 encoding
- Includes checksum validation for data integrity
- Combines offer_id and user_id in the encrypted code
- Requires `ENCRYPTION_SECRET` environment variable

## Database Requirements
The API joins the following tables:
- `offers` - Contains offer details
- `vendors` - Contains vendor information
- `members` - Contains member information (for vendor validation)

## Security Notes
- Validates offer ownership for vendors
- Checks offer expiration dates
- Verifies offer status before validation
- Uses checksum to detect corrupted codes
