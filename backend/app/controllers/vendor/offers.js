import { executeQuery } from "../../utils/run_query.js";
import { OFFER_REDEEM_STATUS, OFFER_STATUS, MESSAGES, STATUS_CODES } from "../../utils/offerConstants.js";

export const addOffers = (req, res) => {
    console.log("SANTHOSH IS IS : ");
    try {
       const {title,description, image, discount, discount_code, start_date,end_date} = req.body;
       const vendor_id = req.user?.id;
        console.log("SANTHOSH IS IS : "+vendor_id);

        if (!title || !description || !discount || !discount_code || !start_date || !image || !end_date)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

            const query = "SELECT * FROM offers WHERE title = ? AND vendor_id = ?";
            executeQuery({
                query,
                data: [title,vendor_id],
                callback: (err, prodData) => 
                {
                    if (prodData[0])
                    {
                        return res
                        .status(404)
                        .json({ error: [{ message: "this offer is already exist" }], result: {} });
                    }
                    else
                    {
                        const query = "INSERT INTO offers (title, description, image, discount, discount_code, vendor_id, start_date, end_date)VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                        executeQuery({
                                    query,
                                    data: [title,description, image, discount, discount_code, vendor_id,start_date,end_date],
                                    callback: (err, prodInData) => {
                                        console.log("SANTHOSH offer Error:", err);
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "add offer successfuly",
                                            status: 1
                                        };
                                        return res.status(200).json({ error: [], result });
                                    }
                        });
                    }

                }
            })

    } 
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const getOffers = (req, res) => {

    try {
        const vendor_id = req.user?.id;
        const query =  "SELECT * FROM  offers WHERE vendor_id = ?";
        
        executeQuery({
            query,
            data: [vendor_id],
            callback: (err, productData) => 
            {
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


export const updateOfferStatus = (req, res) => {
    
    try {
       const {status,id} = req.body;

        if (!id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

            const query = "SELECT * FROM offers WHERE id = ?";
            executeQuery({
                query,
                data: [id],
                callback: (err, prodData) => 
                {
                    if (!prodData[0])
                    {
                        return res
                        .status(404)
                        .json({ error: [{ message: "this offer is no exist" }], result: {} });
                    }
                    else
                    {
                        const query = "UPDATE offers SET status = ?, created_at = NOW() WHERE id = ?";
                        executeQuery({
                                    query,
                                    data: [status,id],
                                    callback: (err, prodInData) => {
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "update product status successful",
                                            status: 1
                                        };
                                        return res.status(200).json({ error: [], result });
                                    }
                        });
                    }

                }
            })

    } 
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const updateOfferImage = (req, res) => {
    
    try {
       const {image,id} = req.body;

        if (!image || !id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

            const query = "SELECT * FROM offers WHERE id = ?";
            executeQuery({
                query,
                data: [id],
                callback: (err, prodData) => 
                {
                    if (!prodData[0])
                    {
                        return res
                        .status(404)
                        .json({ error: [{ message: "this product is no exist" }], result: {} });
                    }
                    else
                    {
                        const query = "UPDATE offers SET image = ?, created_at = NOW() WHERE id = ?";
                        executeQuery({
                                    query,
                                    data: [image,id],
                                    callback: (err, prodInData) => {
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "update offer image successfuly",
                                            status: 1
                                        };
                                        return res.status(200).json({ error: [], result });
                                    }
                        });
                    }

                }
            })

    } 
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const updateOfferDetails = (req, res) => {
    
    try {
       const {title,description, discount, discount_code, start_date,end_date,id} = req.body;
       console.log(req.body)

        if (!title || !description|| !discount|| !discount_code|| !start_date || !end_date || !id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

            const query = "SELECT * FROM offers WHERE id = ?";
            executeQuery({
                query,
                data: [id],
                callback: (err, prodData) => 
                {
                    if (!prodData[0])
                    {
                        return res
                        .status(404)
                        .json({ error: [{ message: "this offer is no exist" }], result: {} });
                    }
                    else
                    {
                        const query = "UPDATE offers SET title = ?, description = ?, discount = ?, discount_code = ?, start_date = ?, end_date = ?, created_at = NOW() WHERE id = ?";
                        executeQuery({
                                    query,
                                    data: [title,description, discount, discount_code, start_date, end_date, id],
                                    callback: (err, prodInData) => {
                                        console.log(err)
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "update offer details successfuly",
                                            status: 1
                                        };
                                        return res.status(200).json({ error: [], result });
                                    }
                        });
                    }

                }
            })

    } 
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const deleteOffer = (req, res) => {
    
    try {
       const {id} = req.body;

        if (!id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

        const query = "DELETE FROM offers WHERE id = ?";
        executeQuery({
            query,
            data: [id],
            callback: (err, resultData) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                const result = {
                    message: "Offer deleted successfully",
                    status: 1
                };
                return res.status(200).json({ error: [], result });
            }
        });

    } 
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const offers_validity_check = async (req, res) => {
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

        // Import encryptionHelper dynamically since it's not imported at the top
        const encryptionHelper = (await import("../../utils/encryptionHelper.js")).default;

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

        // Check if the offer exists and belongs to the current vendor
        const current_vendor_id = req.user?.id;
        const checkOfferQuery = `
            SELECT o.*, v.name as vendor_name, m.name as member_name 
            FROM offers o 
            JOIN users v ON o.vendor_id = v.id 
            JOIN users m ON m.id = ?
            WHERE o.id = ? 
            AND o.vendor_id = ?
            AND o.status = ? 
            AND (o.end_date IS NULL OR o.end_date > NOW())
            AND (o.start_date IS NULL OR o.start_date <= NOW())
        `;

        executeQuery({
            query: checkOfferQuery,
            data: [user_id, offer_id, current_vendor_id, OFFER_STATUS.ACTIVE],
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
                        error: "Offer not found, inactive, expired, or doesn't belong to this vendor"
                    });
                }

                const offer = offerData[0];

                // Check if this offer has already been used by this user
                const checkUsageQuery = `
                    SELECT * FROM offer_redeem 
                    WHERE offer_id = ? AND user_id = ? AND redeem_status = '1'
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
                                member_name: offer.member_name,
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
        const { offer_id, user_id, notes } = req.body;
        const current_vendor_id = req.user?.id;
        
        // Validate required parameters
        if (!offer_id || !user_id) {
            return res.status(400).json({
                status: 0,
                message: "offer_id and user_id are required",
                error: "Missing required parameters"
            });
        }

        // Check if offer is already marked as used
        const checkExistingQuery = `
            SELECT * FROM offer_redeem 
            WHERE offer_id = ? AND user_id = ? AND redeem_status = '1'
        `;

        executeQuery({
            query: checkExistingQuery,
            data: [offer_id, user_id],
            callback: (checkErr, checkData) => {
                if (checkErr) {
                    console.log("Database error checking existing usage")
                    return res.status(500).json({
                        status: 0,
                        message: "Database error checking existing usage",
                        error: checkErr.message
                    });
                }

                if (checkData && checkData.length > 0) {
                    console.log("This offer has already been marked as used")
                    return res.status(400).json({
                        status: 0,
                        message: "This offer has already been marked as used",
                        error: "Offer cannot be used again"
                    });
                }

                // Insert or update the offer_redeem record
                const insertQuery = `
                    INSERT INTO offer_redeem (offer_id, user_id, vendor_id, redeem_status, notes) 
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                    redeem_status = ?, 
                    notes = ?, 
                    created_at = NOW()
                `;

                executeQuery({
                    query: insertQuery,
                    data: [offer_id, user_id, current_vendor_id, 1, notes || '', 1, notes || ''],
                    callback: (insertErr, insertData) => {
                        if (insertErr) {
                            console.log("TDatabase error marking offer as used")
                            console.log(insertErr.message)
                            return res.status(500).json({
                                status: 0,
                                message: "Database error marking offer as used",
                                error: insertErr.message
                            });
                        }
                        console.log("Offer marked as used successfully")
                        const result = {
                            message: "Offer marked as used successfully",
                            status: 1,
                            data: {
                                offer_id: offer_id,
                                user_id: user_id,
                                vendor_id: current_vendor_id,
                                redeem_status: 1,
                                notes: notes || ''
                            }
                        };

                        return res.status(200).json({ error: [], result });
                    }
                });
            }
        });

    } catch (err) {
        console.log("Mark offer as used error")
        console.error("Mark offer as used error:", err);
        res.status(500).json({ 
            status: 0, 
            message: "Server error", 
            error: err.message 
        });
    }
}

