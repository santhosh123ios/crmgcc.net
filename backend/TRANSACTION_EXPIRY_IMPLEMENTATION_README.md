# Transaction Expiry Implementation

## Overview
This implementation adds an `expire_on` field to the transaction table and automatically calculates expiry dates based on the `transaction_expiry_time` setting from the `transaction_settings` table.

## Database Changes

### 1. Add expire_on Field to Transaction Table
Run the SQL script `add_expire_on_to_transaction.sql` to add the new field:

```sql
-- Add expire_on field to transaction table
ALTER TABLE `transaction` ADD COLUMN `expire_on` DATE NULL AFTER `transaction_created_at`;

-- Add index for better performance on expiry queries
CREATE INDEX `idx_transaction_expire_on` ON `transaction` (`expire_on`);
```

## Code Changes Made

### 1. Vendor Transaction Controller (`app/controllers/vendor/Transaction.js`)

#### Updated Functions:
- `addTransaction()` - Added expiry date calculation and updated INSERT statements
- `add_vendor_topup()` - Added expiry date calculation and updated INSERT statements

#### Changes Made:
- Added transaction settings query to get `transaction_expiry_time`
- Calculate expiry date by adding days to current date
- Updated all INSERT statements to include `expire_on` field
- Modified `transactionDR()` and `transactionCR()` functions to accept expiry date parameter

### 2. Admin Transaction Controller (`app/controllers/admin/Transaction.js`)

#### Updated Functions:
- `addAdminTopup()` - Added expiry date calculation and updated INSERT statement
- `add_redeem_transaction()` - Added expiry date calculation and updated INSERT statements
- `addTransaction()` - Added expiry date calculation and updated INSERT statements

#### Changes Made:
- Added transaction settings query to get `transaction_expiry_time`
- Calculate expiry date by adding days to current date
- Updated all INSERT statements to include `expire_on` field
- Modified `transactionDR()` and `transactionCR()` functions to accept expiry date parameter

### 3. Main Auth Controller (`app/controllers/main/Auth.js`)

#### Updated Functions:
- Login welcome points transaction - Added expiry date calculation
- `addCard()` - Added expiry date calculation for welcome points

#### Changes Made:
- Added expiry date calculation (default 30 days for welcome points)
- Updated INSERT statements to include `expire_on` field

## How It Works

### 1. Expiry Date Calculation
```javascript
// Get transaction settings
const settingsQuery = "SELECT transaction_expiry_time FROM transaction_settings ORDER BY id DESC LIMIT 1";

// Calculate expiry date
const expiryDays = settingsData[0]?.transaction_expiry_time || 30; // Default to 30 days
const currentDate = new Date();
const expiryDate = new Date(currentDate.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
const formattedExpiryDate = expiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
```

### 2. Updated INSERT Statements
All transaction INSERT statements now include the `expire_on` field:

```sql
INSERT INTO transaction (
    transaction_type, transaction_cr, transaction_dr, transaction_title, 
    user_id, from_id, to_id, card_id, card_no, expire_on
) SELECT ?, ?, ?, ?, ?, ?, ?, c.card_id, c.card_no, ? 
FROM cards c WHERE c.user_id = ? LIMIT 1;
```

## Files Modified

1. `add_expire_on_to_transaction.sql` - Database schema changes
2. `app/controllers/vendor/Transaction.js` - Vendor transaction functions
3. `app/controllers/admin/Transaction.js` - Admin transaction functions
4. `app/controllers/main/Auth.js` - Login and card creation transactions

## Implementation Steps

### Step 1: Run Database Script
```bash
mysql -u username -p database_name < add_expire_on_to_transaction.sql
```

### Step 2: Verify Code Changes
All the necessary code changes have been implemented. The system will now:
- Automatically fetch transaction expiry settings
- Calculate expiry dates for all new transactions
- Store expiry dates in the `expire_on` field

### Step 3: Test the Implementation
Test the following scenarios:
1. Vendor transactions (point transfers)
2. Admin topups
3. Redeem transactions
4. Welcome points on login/card creation

## Benefits

1. **Automatic Expiry Management**: All transactions now have expiry dates automatically calculated
2. **Configurable Expiry**: Expiry duration can be configured via the transaction_settings table
3. **Data Integrity**: Consistent expiry date calculation across all transaction types
4. **Performance**: Added database index for efficient expiry queries

## Notes

- Default expiry is set to 30 days if no setting is found in transaction_settings
- Welcome points (login/card creation) use a hardcoded 30-day expiry
- All existing transaction functions maintain backward compatibility
- The `expire_on` field is nullable to handle any existing transactions

## Future Enhancements

1. **Expiry Notifications**: Send notifications before points expire
2. **Expiry Reports**: Generate reports of expired/expiring points
3. **Automatic Cleanup**: Clean up expired transactions
4. **Expiry Rules**: Different expiry rules for different transaction types
