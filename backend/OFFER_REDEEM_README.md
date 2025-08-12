# Offer Redemption Tracking System

This document describes the new offer redemption tracking functionality that has been added to prevent users from using the same offer multiple times.

## Database Table

The `offer_redeem` table has been created with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `id` | int(11) | Primary key, auto increment |
| `offer_id` | int(11) | Foreign key to offers table |
| `user_id` | int(11) | Foreign key to users table (member) |
| `vendor_id` | int(11) | Foreign key to users table (vendor) |
| `redeemed_at` | timestamp | When the offer was redeemed |
| `redeem_status` | enum | Status: '0'=active, '1'=used, '2'=expired, '3'=cancelled |
| `notes` | text | Optional notes about the redemption |
| `created_at` | timestamp | Record creation timestamp |
| `updated_at` | timestamp | Last update timestamp |

## Key Features

1. **Unique Constraint**: Each offer can only be used once per user (`unique_offer_user`)
2. **Foreign Key Constraints**: Ensures data integrity with offers and users tables
3. **Status Tracking**: Multiple statuses for different redemption states
4. **Audit Trail**: Timestamps for creation and updates

## API Endpoints

### 1. Enhanced Offers Validity Check
- **URL**: `POST /api/member/offers_validity_check` and `POST /api/vendor/offers_validity_check`
- **Authentication**: Required (Member/Vendor)
- **New Feature**: Now checks if the offer has already been used by the user
- **Response for Used Offers**:
```json
{
  "status": 0,
  "message": "This offer has already been used",
  "error": "Offer cannot be used again by the same user"
}
```

### 2. Mark Offer as Used
- **URL**: `POST /api/member/mark_offer_as_used` and `POST /api/vendor/mark_offer_as_used`
- **Authentication**: Required (Member/Vendor)
- **Purpose**: Mark an offer as used when it's actually redeemed
- **Request Body**:
```json
{
  "offer_id": 123,
  "user_id": 456,
  "vendor_id": 789,  // Only required for member endpoint
  "notes": "Optional notes about the redemption"
}
```
- **Response**:
```json
{
  "error": [],
  "result": {
    "message": "Offer marked as used successfully",
    "status": 1,
    "data": {
      "offer_id": 123,
      "user_id": 456,
      "vendor_id": 789,
      "redeem_status": "used",
      "notes": "Optional notes about the redemption"
    }
  }
}
```

## Workflow

1. **Generate Offer Code**: Member generates an encrypted offer code
2. **Validate Offer**: Use `offers_validity_check` to verify offer is valid and unused
3. **Redeem Offer**: When the offer is actually used, call `mark_offer_as_used`
4. **Prevent Reuse**: Subsequent calls to `offers_validity_check` will return "already used" error

## Setup Instructions

1. Run the SQL script to create the table:
```sql
source offer_redeem_table.sql
```

2. The new functionality is automatically integrated into existing `offers_validity_check` endpoints

3. Use the new `mark_offer_as_used` endpoint when offers are actually redeemed

## Benefits

- **Prevents Double Usage**: Users cannot use the same offer multiple times
- **Audit Trail**: Complete history of offer redemptions
- **Data Integrity**: Foreign key constraints ensure data consistency
- **Flexible Status**: Support for different redemption states
- **Backward Compatible**: Existing APIs continue to work

## Error Handling

The system handles various error scenarios:
- Database connection issues
- Invalid offer codes
- Already used offers
- Authorization failures
- Missing required parameters

## Security Features

- User authentication required for all endpoints
- User ID validation to prevent unauthorized access
- Vendor ID validation for vendor-specific operations
- Encrypted offer codes for secure transmission
