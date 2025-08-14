import { processExpiredTransactions } from './app/services/cronService.js';

console.log('Testing expired transaction processing...');
console.log('Current time:', new Date().toISOString());

// Test the expired transaction processing
processExpiredTransactions()
    .then(() => {
        console.log('Test completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Test failed:', error);
        process.exit(1);
    });
