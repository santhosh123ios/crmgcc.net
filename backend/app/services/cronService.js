import cron from 'node-cron';
import { executeQuery } from '../utils/run_query.js';

// Function to check and process expired transactions
const processExpiredTransactions = async () => {
    try {
        console.log('Starting expired transaction check at:', new Date().toISOString());
        
        // Get current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Find all expired transactions where expire_on is less than current date
        const expiredTransactionsQuery = `
            SELECT 
                t.transaction_id,
                t.user_id,
                t.transaction_cr,
                t.transaction_dr,
                t.transaction_title,
                t.card_id,
                t.card_no,
                t.expire_on
            FROM transaction t
            WHERE t.expire_on < ? 
            AND t.transaction_cr > 0 
            AND t.is_expired = 0
        `;
        
        executeQuery({
            query: expiredTransactionsQuery,
            data: [currentDate],
            callback: async (err, expiredTransactions) => {
                if (err) {
                    console.error('Error fetching expired transactions:', err);
                    return;
                }
                
                if (expiredTransactions.length === 0) {
                    console.log('No expired transactions found');
                    return;
                }
                
                console.log(`Found ${expiredTransactions.length} expired transactions`);
                
                // Process each expired transaction
                for (const transaction of expiredTransactions) {
                    await processExpiredTransaction(transaction);
                }
                
                console.log('Expired transaction processing completed');
            }
        });
        
    } catch (error) {
        console.error('Error in processExpiredTransactions:', error);
    }
};

// Function to process individual expired transaction
const processExpiredTransaction = async (transaction) => {
    try {
        console.log(`Processing expired transaction ID: ${transaction.transaction_id}`);
        
        // Calculate the amount to move (transaction_cr - transaction_dr)
        const amountToMove = transaction.transaction_cr - (transaction.transaction_dr || 0);
        
        if (amountToMove <= 0) {
            console.log(`Transaction ${transaction.transaction_id} has no positive balance to move`);
            return;
        }
        
        // Mark transaction as expired
        const markExpiredQuery = `
            UPDATE transaction 
            SET is_expired = 1 
            WHERE transaction_id = ?
        `;
        
        executeQuery({
            query: markExpiredQuery,
            data: [transaction.transaction_id],
            callback: (err) => {
                if (err) {
                    console.error(`Error marking transaction ${transaction.transaction_id} as expired:`, err);
                    return;
                }
                
                // Create admin transaction (CR) - money going to admin
                const adminCRQuery = `
                    INSERT INTO transaction (
                        transaction_type, transaction_cr, transaction_dr, 
                        transaction_title, user_id, from_id, to_id, 
                        card_id, card_no, created_at
                    ) VALUES (1, ?, 0, ?, ?, ?, ?, ?, ?, NOW())
                `;
                
                executeQuery({
                    query: adminCRQuery,
                    data: [
                        amountToMove,
                        `Expired Transaction Recovery - ${transaction.transaction_title}`,
                        1, // admin user_id (assuming 1 is admin)
                        transaction.user_id,
                        1, // admin user_id
                        transaction.card_id,
                        transaction.card_no
                    ],
                    callback: (err) => {
                        if (err) {
                            console.error(`Error creating admin CR transaction for ${transaction.transaction_id}:`, err);
                            return;
                        }
                        
                        // Create member transaction (DR) - money deducted from member
                        const memberDRQuery = `
                            INSERT INTO transaction (
                                transaction_type, transaction_cr, transaction_dr, 
                                transaction_title, user_id, from_id, to_id, 
                                card_id, card_no, created_at
                            ) VALUES (2, 0, ?, ?, ?, ?, ?, ?, ?, NOW())
                        `;
                        
                        executeQuery({
                            query: memberDRQuery,
                            data: [
                                amountToMove,
                                `Expired Transaction Deduction - ${transaction.transaction_title}`,
                                transaction.user_id,
                                transaction.user_id,
                                1, // admin user_id
                                transaction.card_id,
                                transaction.card_no
                            ],
                            callback: (err) => {
                                if (err) {
                                    console.error(`Error creating member DR transaction for ${transaction.transaction_id}:`, err);
                                    return;
                                }
                                
                                console.log(`Successfully processed expired transaction ${transaction.transaction_id}. Moved ${amountToMove} points from member ${transaction.user_id} to admin`);
                            }
                        });
                    }
                });
            }
        });
        
    } catch (error) {
        console.error(`Error processing expired transaction ${transaction.transaction_id}:`, error);
    }
};

// Initialize cron job to run at midnight (00:00) every day
export const initExpiredTransactionCron = () => {
    // Schedule cron job to run at midnight every day
    cron.schedule('0 0 * * *', () => {
        console.log('Running expired transaction cron job at midnight');
        processExpiredTransactions();
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Adjust timezone as needed
    });
    
    console.log('Expired transaction cron job scheduled to run at midnight daily');
};

// Export for manual testing if needed
export { processExpiredTransactions, processExpiredTransaction };
