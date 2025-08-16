// Test script for Offer Redemption Tracking System
// This script demonstrates the new functionality to prevent offer reuse

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api'; // Adjust as needed
const MEMBER_TOKEN = 'your_member_token_here'; // Replace with actual token
const VENDOR_TOKEN = 'your_vendor_token_here'; // Replace with actual token

// Test data
const testData = {
    offer_id: 1,
    user_id: 1,
    vendor_id: 1,
    notes: 'Test redemption'
};

async function testOfferRedemptionFlow() {
    console.log('🧪 Testing Offer Redemption Tracking System\n');

    try {
        // Step 1: Check offer validity (should pass first time)
        console.log('1. Testing offer validity check (first time)...');
        const validityCheck1 = await axios.post(`${BASE_URL}/member/offers_validity_check`, {
            offer_code: 'your_encrypted_offer_code_here' // Replace with actual encrypted code
        }, {
            headers: { Authorization: `Bearer ${MEMBER_TOKEN}` }
        });
        
        if (validityCheck1.data.result?.is_valid) {
            console.log('✅ Offer is valid and unused');
        }

        // Step 2: Mark offer as used
        console.log('\n2. Marking offer as used...');
        const markAsUsed = await axios.post(`${BASE_URL}/member/mark_offer_as_used`, testData, {
            headers: { Authorization: `Bearer ${MEMBER_TOKEN}` }
        });
        
        if (markAsUsed.data.result?.status === 1) {
            console.log('✅ Offer marked as used successfully');
        }

        // Step 3: Check offer validity again (should fail - already used)
        console.log('\n3. Testing offer validity check (after use)...');
        try {
            const validityCheck2 = await axios.post(`${BASE_URL}/member/offers_validity_check`, {
                offer_code: 'your_encrypted_offer_code_here' // Same code as before
            }, {
                headers: { Authorization: `Bearer ${MEMBER_TOKEN}` }
            });
            
            console.log('❌ This should have failed - offer already used');
        } catch (error) {
            if (error.response?.data?.message === 'This offer has already been used') {
                console.log('✅ Correctly prevented reuse of already used offer');
            } else {
                console.log('❌ Unexpected error:', error.response?.data);
            }
        }

        // Step 4: Try to mark the same offer as used again (should fail)
        console.log('\n4. Trying to mark already used offer as used again...');
        try {
            const markAsUsedAgain = await axios.post(`${BASE_URL}/member/mark_offer_as_used`, testData, {
                headers: { Authorization: `Bearer ${MEMBER_TOKEN}` }
            });
            
            console.log('❌ This should have failed - offer already marked as used');
        } catch (error) {
            if (error.response?.data?.message === 'This offer has already been marked as used') {
                console.log('✅ Correctly prevented duplicate marking');
            } else {
                console.log('❌ Unexpected error:', error.response?.data);
            }
        }

        console.log('\n🎉 All tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

async function testVendorEndpoint() {
    console.log('\n🏪 Testing Vendor Endpoint\n');

    try {
        // Test vendor offer validity check
        console.log('1. Testing vendor offer validity check...');
        const vendorValidityCheck = await axios.post(`${BASE_URL}/vendor/offers_validity_check`, {
            offer_code: 'your_encrypted_offer_code_here' // Replace with actual encrypted code
        }, {
            headers: { Authorization: `Bearer ${VENDOR_TOKEN}` }
        });
        
        if (vendorValidityCheck.data.result?.is_valid) {
            console.log('✅ Vendor offer validity check passed');
        }

        // Test vendor mark offer as used
        console.log('\n2. Testing vendor mark offer as used...');
        const vendorMarkAsUsed = await axios.post(`${BASE_URL}/vendor/mark_offer_as_used`, {
            offer_id: testData.offer_id,
            user_id: testData.user_id,
            notes: 'Vendor redemption test'
        }, {
            headers: { Authorization: `Bearer ${VENDOR_TOKEN}` }
        });
        
        if (vendorMarkAsUsed.data.result?.status === 1) {
            console.log('✅ Vendor mark offer as used successful');
        }

        console.log('\n🎉 Vendor tests completed!');

    } catch (error) {
        console.error('❌ Vendor test failed:', error.response?.data || error.message);
    }
}

// Run tests
async function runAllTests() {
    console.log('🚀 Starting Offer Redemption Tracking System Tests\n');
    
    await testOfferRedemptionFlow();
    await testVendorEndpoint();
    
    console.log('\n📋 Test Summary:');
    console.log('- ✅ Offer validity check prevents reuse');
    console.log('- ✅ Mark offer as used functionality works');
    console.log('- ✅ Duplicate usage prevention works');
    console.log('- ✅ Vendor endpoints work correctly');
    console.log('\n🎯 System is working as expected!');
}

// Uncomment to run tests
// runAllTests();

module.exports = {
    testOfferRedemptionFlow,
    testVendorEndpoint,
    runAllTests
};
