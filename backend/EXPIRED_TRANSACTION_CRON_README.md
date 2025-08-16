# Expired Transaction Cron Job Implementation

This implementation adds an automated cron job that runs at midnight every day to check for expired transactions and automatically move expired amounts from members to admin.

## Features

- **Automatic Execution**: Runs at midnight (00:00) every day
- **Expired Transaction Detection**: Finds transactions where `expire_on` date has passed
- **Automatic Transfer**: Moves expired transaction amounts from members to admin
- **Transaction Tracking**: Marks processed transactions to prevent duplicate processing
- **Logging**: Comprehensive logging for monitoring and debugging

## Database Changes Required

Before running the cron job, you need to add the `is_expired` field to the transaction table:

```sql
-- Run this SQL script
mysql -u username -p database_name < add_is_expired_to_transaction.sql
```

This will:
1. Add `is_expired` TINYINT(1) field to the transaction table
2. Create an index for better performance
3. Mark existing expired transactions as processed

## How It Works

### 1. Cron Job Schedule
- **Timing**: Runs at midnight (00:00) every day
- **Timezone**: Asia/Kolkata (configurable in cronService.js)
- **Pattern**: `0 0 * * *` (every day at 00:00)

### 2. Expired Transaction Detection
The cron job finds transactions where:
- `expire_on` < current date
- `transaction_cr` > 0 (has positive balance)
- `is_expired` = 0 (not yet processed)

### 3. Transaction Processing
For each expired transaction:
1. **Mark as Expired**: Sets `is_expired` = 1
2. **Admin Credit**: Creates admin transaction (CR) with expired amount
3. **Member Debit**: Creates member transaction (DR) to deduct expired amount
4. **Logging**: Records all actions for audit trail

### 4. Transaction Types
- **Transaction Type 1**: Credit transaction (CR)
- **Transaction Type 2**: Debit transaction (DR)

## Files Added/Modified

### New Files
- `app/services/cronService.js` - Main cron job service
- `add_is_expired_to_transaction.sql` - Database schema update
- `test_expired_transaction_cron.js` - Manual testing script
- `EXPIRED_TRANSACTION_CRON_README.md` - This documentation

### Modified Files
- `app.js` - Added cron service initialization
- `package.json` - Added node-cron dependency

## Installation & Setup

### 1. Install Dependencies
```bash
npm install node-cron
```

### 2. Update Database
```bash
mysql -u username -p database_name < add_is_expired_to_transaction.sql
```

### 3. Restart Server
The cron job will automatically start when the server starts.

## Testing

### Manual Test
```bash
node test_expired_transaction_cron.js
```

### Monitor Logs
Check server console for cron job execution logs:
```
Running expired transaction cron job at midnight
Starting expired transaction check at: 2024-01-XX...
Found X expired transactions
Successfully processed expired transaction X...
```

## Configuration

### Timezone
Edit `app/services/cronService.js` to change timezone:
```javascript
timezone: "Asia/Kolkata" // Change to your preferred timezone
```

### Cron Schedule
Modify the cron pattern in `initExpiredTransactionCron()`:
```javascript
// Current: midnight every day
cron.schedule('0 0 * * *', ...)

// Examples:
// Every hour: '0 * * * *'
// Every 6 hours: '0 */6 * * *'
// Specific time: '30 2 * * *' (2:30 AM)
```

## Monitoring & Maintenance

### Logs to Watch
- Cron job start/stop messages
- Number of expired transactions found
- Success/failure of individual transaction processing
- Database errors

### Database Queries for Monitoring
```sql
-- Check expired transactions
SELECT COUNT(*) FROM transaction WHERE expire_on < CURDATE();

-- Check processed expired transactions
SELECT COUNT(*) FROM transaction WHERE is_expired = 1;

-- Check pending expired transactions
SELECT COUNT(*) FROM transaction WHERE expire_on < CURDATE() AND is_expired = 0;
```

## Error Handling

The system includes comprehensive error handling:
- Database connection errors
- Query execution failures
- Individual transaction processing errors
- Logging of all errors for debugging

## Security Considerations

- Only processes transactions where `is_expired = 0`
- Prevents duplicate processing
- Maintains audit trail of all actions
- Uses existing transaction system for consistency

## Troubleshooting

### Common Issues

1. **Cron Job Not Running**
   - Check server logs for initialization messages
   - Verify timezone settings
   - Ensure server is running

2. **Database Errors**
   - Verify `is_expired` field exists
   - Check database permissions
   - Review error logs

3. **Transactions Not Processing**
   - Verify `expire_on` dates are set correctly
   - Check `is_expired` field values
   - Review transaction data integrity

### Debug Mode
Enable additional logging by modifying the cron service:
```javascript
// Add more detailed logging
console.log('Transaction details:', JSON.stringify(transaction, null, 2));
```

## Support

For issues or questions:
1. Check server logs for error messages
2. Verify database schema matches requirements
3. Test with manual execution script
4. Review transaction data for anomalies
