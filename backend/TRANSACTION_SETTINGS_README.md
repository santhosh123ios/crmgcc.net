# Transaction Settings API

This document describes the Transaction Settings functionality that has been added to the admin panel.

## Database Table

The `transaction_settings` table has been created with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `id` | int(11) | Primary key, auto increment |
| `daily_limit` | int(11) | Daily transaction limit amount |
| `minimum_redeem_limit` | int(11) | Minimum amount required for redemption |
| `maximum_redeem_limit` | int(11) | Maximum amount allowed for redemption |
| `transaction_charges` | int(11) | Transaction charges percentage/amount |
| `updated_at` | timestamp | Last update timestamp |

## API Endpoints

### 1. Get Transaction Settings
- **URL**: `GET /admin/get_transaction_settings`
- **Authentication**: Required (Admin)
- **Description**: Retrieves the current transaction settings
- **Response**:
```json
{
  "error": [],
  "result": {
    "message": "Get transaction settings",
    "status": 1,
    "data": {
      "id": 1,
      "daily_limit": 1000,
      "minimum_redeem_limit": 50,
      "maximum_redeem_limit": 5000,
      "transaction_charges": 2,
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 2. Update Transaction Settings
- **URL**: `POST /admin/update_transaction_settings`
- **Authentication**: Required (Admin)
- **Description**: Updates or creates transaction settings
- **Request Body**:
```json
{
  "daily_limit": 1000,
  "minimum_redeem_limit": 50,
  "maximum_redeem_limit": 5000,
  "transaction_charges": 2
}
```
- **Response**:
```json
{
  "error": [],
  "result": {
    "message": "Transaction settings updated successfully",
    "status": 1
  }
}
```

## Setup Instructions

1. Run the SQL script `transaction_settings_table.sql` to create the table:
```sql
-- Execute the SQL script
source transaction_settings_table.sql
```

2. The table will be created with default values:
   - Daily Limit: 1000
   - Minimum Redeem Limit: 50
   - Maximum Redeem Limit: 5000
   - Transaction Charges: 2

## Usage

1. **Get Settings**: Call the GET endpoint to retrieve current settings
2. **Update Settings**: Call the POST endpoint with new values to update settings
3. **Validation**: All fields are required when updating settings
4. **Auto-update**: The `updated_at` field is automatically updated when settings are modified

## Error Handling

- Returns 404 if required fields are missing
- Returns 500 for database errors
- Returns 401 for unauthorized access (requires admin authentication) 