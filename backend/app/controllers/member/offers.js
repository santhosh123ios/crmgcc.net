import { executeQuery } from "../../utils/run_query.js";
import encryptionHelper from "../../utils/encryptionHelper.js";

export const getAllOffers = (req, res) => {

    try {
        const vendor_id = req.user?.id;
        const query = "SELECT * FROM  offers";

        executeQuery({
            query,
            data: [vendor_id],
            callback: (err, productData) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                const result = {
                    message: "get all offers",
                    status: 1,
                    data: productData,
                };

                return res.status(200).json({ error: [], result });
            }
        })
    }
    catch (err) {
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const generateOfferCode = (req, res) => {
    try {
        const { offer_id } = req.body;
        const user_id = req.user?.id;
        
        // Validate required parameters
        if (!offer_id || !user_id) {
            return res.status(400).json({
                status: 0,
                message: "offer_id and user_id are required",
                error: "Missing required parameters"
            });
        }

        // Check offer validity
        const checkOfferQuery = `
            SELECT * FROM offers 
            WHERE id = ? 
            AND status = '1' 
            AND (end_date IS NULL OR end_date > NOW())
            AND (start_date IS NULL OR start_date <= NOW())
        `;

        executeQuery({
            query: checkOfferQuery,
            data: [offer_id],
            callback: (err, offerData) => {
                if (err) {
                    return res.status(500).json({
                        status: 0,
                        message: "Database error",
                        error: err.message
                    });
                }

                if (!offerData || offerData.length === 0) {
                    return res.status(400).json({
                        status: 0,
                        message: "Invalid or expired offer",
                        error: "Offer not found or not valid"
                    });
                }

                // Generate short encrypted code using the common encryption helper
                const encryptedCode = encryptionHelper.generateReversibleOfferCode({ offer_id, user_id });

                const result = {
                    message: "Offer code generated successfully",
                    status: 1,
                    data: {
                        offer_id: offer_id,
                        user_id: user_id,
                        encrypted_code: encryptedCode,
                        offer_details: offerData[0]
                    }
                };

                return res.status(200).json({ error: [], result });
            }
        });

    } catch (err) {
        res.status(500).json({ 
            status: 0, 
            message: "Server error", 
            error: err.message 
        });
    }
}

export const offers_validity_check = (req, res) => {
    try {
        const { offer_code } = req.body;
        
        // Validate required parameters
        if (!offer_code) {
            return res.status(400).json({
                status: 0,
                message: "offer_code is required",
                error: "Missing required parameter"
            });
        }

        // Decrypt the offer code to get offer_id and user_id
        let decryptedData;
        try {
            decryptedData = encryptionHelper.decryptReversibleOfferCode(offer_code);
        } catch (decryptError) {
            return res.status(400).json({
                status: 0,
                message: "Invalid offer code",
                error: decryptError.message
            });
        }

        const { offer_id, user_id } = decryptedData;

        // Check if the offer exists and is valid
        const checkOfferQuery = `
            SELECT o.*, v.name as vendor_name 
            FROM offers o 
            JOIN vendors v ON o.vendor_id = v.id 
            WHERE o.id = ? 
            AND o.status = '1' 
            AND (o.end_date IS NULL OR o.end_date > NOW())
            AND (o.start_date IS NULL OR o.start_date <= NOW())
        `;

        executeQuery({
            query: checkOfferQuery,
            data: [offer_id],
            callback: (err, offerData) => {
                if (err) {
                    return res.status(500).json({
                        status: 0,
                        message: "Database error",
                        error: err.message
                    });
                }

                if (!offerData || offerData.length === 0) {
                    return res.status(400).json({
                        status: 0,
                        message: "Invalid or expired offer",
                        error: "Offer not found, inactive, or expired"
                    });
                }

                const offer = offerData[0];

                // Check if the user_id from the code matches the current user
                const current_user_id = req.user?.id;
                if (current_user_id && current_user_id != user_id) {
                    return res.status(400).json({
                        status: 0,
                        message: "Invalid offer code for this user",
                        error: "Offer code was generated for a different user"
                    });
                }

                // Check if this offer has already been used by this user
                const checkUsageQuery = `
                    SELECT * FROM offer_redeem 
                    WHERE offer_id = ? AND user_id = ? AND redeem_status = 'used'
                `;

                executeQuery({
                    query: checkUsageQuery,
                    data: [offer_id, user_id],
                    callback: (usageErr, usageData) => {
                        if (usageErr) {
                            return res.status(500).json({
                                status: 0,
                                message: "Database error checking offer usage",
                                error: usageErr.message
                            });
                        }

                        if (usageData && usageData.length > 0) {
                            return res.status(400).json({
                                status: 0,
                                message: "This offer has already been used",
                                error: "Offer cannot be used again by the same user"
                            });
                        }

                        // Offer is valid and hasn't been used yet
                        const result = {
                            message: "Offer code is valid",
                            status: 1,
                            data: {
                                offer_id: offer.id,
                                user_id: user_id,
                                offer_title: offer.title,
                                offer_description: offer.description,
                                discount: offer.discount,
                                discount_code: offer.discount_code,
                                vendor_name: offer.vendor_name,
                                start_date: offer.start_date,
                                end_date: offer.end_date,
                                is_valid: true
                            }
                        };

                        return res.status(200).json({ error: [], result });
                    }
                });
            }
        });

    } catch (err) {
        console.error("Offer validity check error:", err);
        res.status(500).json({ 
            status: 0, 
            message: "Server error", 
            error: err.message 
        });
    }
}

export const markOfferAsUsed = (req, res) => {
    try {
        const { offer_id, user_id, vendor_id, notes } = req.body;
        const current_user_id = req.user?.id;
        
        // Validate required parameters
        if (!offer_id || !user_id || !vendor_id) {
            return res.status(400).json({
                status: 0,
                message: "offer_id, user_id, and vendor_id are required",
                error: "Missing required parameters"
            });
        }

        // Verify that the current user is the one using the offer
        if (current_user_id != user_id) {
            return res.status(400).json({
                status: 0,
                message: "Unauthorized to mark this offer as used",
                error: "User ID mismatch"
            });
        }

        // Check if offer is already marked as used
        const checkExistingQuery = `
            SELECT * FROM offer_redeem 
            WHERE offer_id = ? AND user_id = ? AND redeem_status = 'used'
        `;

        executeQuery({
            query: checkExistingQuery,
            data: [offer_id, user_id],
            callback: (checkErr, checkData) => {
                if (checkErr) {
                    return res.status(500).json({
                        status: 0,
                        message: "Database error checking existing usage",
                        error: checkErr.message
                    });
                }

                if (checkData && checkData.length > 0) {
                    return res.status(400).json({
                        status: 0,
                        message: "This offer has already been marked as used",
                        error: "Offer cannot be used again"
                    });
                }

                // Insert or update the offer_redeem record
                const insertQuery = `
                    INSERT INTO offer_redeem (offer_id, user_id, vendor_id, redeem_status, notes) 
                    VALUES (?, ?, ?, 'used', ?)
                    ON DUPLICATE KEY UPDATE 
                    redeem_status = 'used', 
                    notes = ?, 
                    updated_at = NOW()
                `;

                executeQuery({
                    query: insertQuery,
                    data: [offer_id, user_id, vendor_id, notes || '', notes || ''],
                    callback: (insertErr, insertData) => {
                        if (insertErr) {
                            return res.status(500).json({
                                status: 0,
                                message: "Database error marking offer as used",
                                error: insertErr.message
                            });
                        }

                        const result = {
                            message: "Offer marked as used successfully",
                            status: 1,
                            data: {
                                offer_id: offer_id,
                                user_id: user_id,
                                vendor_id: vendor_id,
                                redeem_status: 'used',
                                notes: notes || ''
                            }
                        };

                        return res.status(200).json({ error: [], result });
                    }
                });
            }
        });

    } catch (err) {
        console.error("Mark offer as used error:", err);
        res.status(500).json({ 
            status: 0, 
            message: "Server error", 
            error: err.message 
        });
    }
}