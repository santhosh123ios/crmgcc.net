// Test script for Offer Code Validation API
// This script demonstrates how to use the new offers_validity_check API

import encryptionHelper from './app/utils/encryptionHelper.js';

// Test data
const testData = {
    offer_id: "123",
    user_id: "456"
};

console.log("=== Offer Code Validation Test ===\n");

try {
    // Step 1: Generate an encrypted offer code
    console.log("1. Generating encrypted offer code...");
    const encryptedCode = encryptionHelper.generateReversibleOfferCode(testData);
    console.log(`   Generated code: ${encryptedCode}`);
    console.log(`   Data: offer_id=${testData.offer_id}, user_id=${testData.user_id}\n`);

    // Step 2: Decrypt the offer code
    console.log("2. Decrypting offer code...");
    const decryptedData = encryptionHelper.decryptReversibleOfferCode(encryptedCode);
    console.log(`   Decrypted data:`, decryptedData);
    console.log(`   Validation: offer_id match = ${decryptedData.offer_id === testData.offer_id}`);
    console.log(`   Validation: user_id match = ${decryptedData.user_id === testData.user_id}\n`);

    // Step 3: Test with invalid code
    console.log("3. Testing with invalid code...");
    try {
        const invalidCode = "invalid.code.here";
        encryptionHelper.decryptReversibleOfferCode(invalidCode);
    } catch (error) {
        console.log(`   Expected error: ${error.message}`);
    }

    console.log("\n=== Test completed successfully! ===");
    console.log("\nTo test the actual API endpoints:");
    console.log("1. POST /api/member/offers_validity_check");
    console.log("2. POST /api/vendor/offers_validity_check");
    console.log("\nRequest body: { \"offer_code\": \"" + encryptedCode + "\" }");

} catch (error) {
    console.error("Test failed:", error.message);
}
