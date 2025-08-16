// Test script to verify SQL syntax fix for offer_redeem table
// This script tests the basic SQL operations that were causing errors

const mysql = require('mysql2/promise');

// Database configuration (adjust as needed)
const dbConfig = {
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
};

async function testOfferRedeemOperations() {
    console.log('🧪 Testing Offer Redeem SQL Operations\n');

    let connection;
    try {
        // Connect to database
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Database connection established');

        // Test 1: Insert a new offer redemption record
        console.log('\n1. Testing INSERT operation...');
        const insertQuery = `
            INSERT INTO offer_redeem (offer_id, user_id, vendor_id, redeem_status, notes) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            redeem_status = ?, 
            notes = ?, 
            updated_at = NOW()
        `;
        
        const insertData = [1, 1, 1, '1', 'Test redemption', '1', 'Test redemption'];
        const [insertResult] = await connection.execute(insertQuery, insertData);
        console.log('✅ INSERT operation successful:', insertResult);

        // Test 2: Check if offer is already used
        console.log('\n2. Testing SELECT operation...');
        const selectQuery = `
            SELECT * FROM offer_redeem 
            WHERE offer_id = ? AND user_id = ? AND redeem_status = ?
        `;
        
        const selectData = [1, 1, '1'];
        const [selectResult] = await connection.execute(selectQuery, selectData);
        console.log('✅ SELECT operation successful:', selectResult);

        // Test 3: Update existing record
        console.log('\n3. Testing UPDATE operation...');
        const updateQuery = `
            UPDATE offer_redeem 
            SET notes = ?, updated_at = NOW() 
            WHERE offer_id = ? AND user_id = ?
        `;
        
        const updateData = ['Updated test redemption', 1, 1];
        const [updateResult] = await connection.execute(updateQuery, updateData);
        console.log('✅ UPDATE operation successful:', updateResult);

        console.log('\n🎉 All SQL operations completed successfully!');
        console.log('✅ The SQL syntax fix is working correctly');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('SQL State:', error.sqlState);
        console.error('Error Code:', error.errno);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run the test
// testOfferRedeemOperations();

module.exports = {
    testOfferRedeemOperations
};
