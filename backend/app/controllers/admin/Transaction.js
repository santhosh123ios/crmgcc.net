import { executeQuery } from "../../utils/run_query.js";

export const getAllTransaction = (req, res) => {

    try {
       const user_id = req.user?.id;
       const query =  "SELECT transaction.*, vendor.name AS vendor_name, vendor.email AS vendor_email, vendor.profile_img AS vendor_image, member.name AS member_name, member.email AS member_email, member.profile_img AS member_image FROM transaction LEFT JOIN users AS vendor ON transaction.vendor_id = vendor.id LEFT JOIN users AS member ON transaction.user_id = member.id";
       executeQuery({
            query,
            data: [],
            callback: (err, userData) => 
            {
                if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                   const result = {
                            message: "get all Transaction",
                            status: 1,
                            data: userData,
                    };
        
                    return res.status(200).json({ error: [], result });
            }
        })
    } 
    catch (err) {
        console.error("Error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}


export const getAllRedeem = (req, res) => {

    try {
        const user_id = req.user?.id;
        //const query = "SELECT * FROM redeems";
        const query = "SELECT redeems.*, member.name AS member_name, member.email AS member_email, member.profile_img AS member_image FROM redeems LEFT JOIN users AS member ON redeems.member_id = member.id;";
        executeQuery({
            query,
            data: [],
            callback: (err, redeemData) => 
            {
                if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                   const result = {
                            message: "Get all redeems",
                            status: 1,
                            data: redeemData,
                    };
        
                    return res.status(200).json({ error: [], result });
            }
        })
    } 
    catch (err) {
        console.error("Error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}


export const addTransaction = (req, res) => {

    try {
       const { transaction_type, transaction_point,transaction_title, member_id } = req.body;
       const user_id = req.user?.id;
        
        if (!transaction_type || !transaction_point || !transaction_title || !user_id || !member_id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

        let transaction_cr = 0;
        let transaction_dr = 0;
        if (transaction_type == 1)
        {
            transaction_cr = transaction_point;
            transaction_dr = 0;
        }
        else
        {
            transaction_cr = 0;
            transaction_dr = transaction_point;
        }
        const query = `INSERT INTO transaction (transaction_type,transaction_cr,transaction_dr,transaction_title,user_id,vendor_id,
                        card_id,card_no ) SELECT ?, ?, ?, ?, ?,?, c.card_id, c.card_no FROM cards c WHERE c.user_id = ? LIMIT 1;`;
        executeQuery({
                    query,
                    data: [ transaction_type, transaction_cr, transaction_dr, transaction_title,member_id,user_id,member_id],
                    callback: (err, trData) => {
                    if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                        const result = {
                            message: "add transaction successful",
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


export const redeemStatusUpdate = (req, res) => {


    console.log(req.body);

    try {
        const { redeem_id, redeem_status, redeem_comment} = req.body;
        
        if (!redeem_id || !redeem_status)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });


        const query = "UPDATE redeems SET redeem_status = ?, redeem_comment = ? WHERE redeem_id = ?";
        //UPDATE leads SET lead_status = ? WHERE id = ?
        executeQuery({
            query,
            data: [redeem_status,redeem_comment, redeem_id],
            callback: (err, userData) => 
            {
                if (err)
                return res
                .status(500)
                .json({ error: [{ message: err }], result: {} });

                const result = {
                message: "Status Updated successfully",
                status: 1,
                };
                return res.status(200).json({ error: [], result });

            }
        })
    } 
    catch (err) {
        console.error("error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const getTransactionSettings = (req, res) => {
    try {
        const query = "SELECT * FROM transaction_settings ORDER BY id DESC LIMIT 1";
        executeQuery({
            query,
            data: [],
            callback: (err, settingsData) => 
            {
                console.log("Query result:", settingsData);
                if (err) {
                    console.error("Database error:", err);
                    return res
                    .status(500)
                    .json({ error: [{ message: err }], result: {} });
                }

                const result = {
                    message: "Get transaction settings",
                    status: 1,
                    data: settingsData[0] || null,
                };
    
                console.log("Sending response:", result);
                return res.status(200).json({ error: [], result });
            }
        })
    } 
    catch (err) {
        console.error("Error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const updateTransactionSettings = (req, res) => {
    try {
        const { daily_limit, minimum_redeem_limit, maximum_redeem_limit, transaction_charges } = req.body;
        
        if (!daily_limit || !minimum_redeem_limit || !maximum_redeem_limit || !transaction_charges)
            return res
              .status(404)
              .json({ error: [{ message: "Input data missing" }], result: {} });

        // Check if settings exist, if not create new, if exists update
        const checkQuery = "SELECT * FROM transaction_settings ORDER BY id DESC LIMIT 1";
        executeQuery({
            query: checkQuery,
            data: [],
            callback: (err, existingData) => {
                if (err)
                    return res
                    .status(500)
                    .json({ error: [{ message: err }], result: {} });

                if (existingData.length > 0) {
                    // Update existing settings
                    const updateQuery = "UPDATE transaction_settings SET daily_limit = ?, minimum_redeem_limit = ?, maximum_redeem_limit = ?, transaction_charges = ?, updated_at = NOW() WHERE id = ?";
                    executeQuery({
                        query: updateQuery,
                        data: [daily_limit, minimum_redeem_limit, maximum_redeem_limit, transaction_charges, existingData[0].id],
                        callback: (err, updateData) => {
                            if (err)
                                return res
                                .status(500)
                                .json({ error: [{ message: err }], result: {} });

                            const result = {
                                message: "Transaction settings updated successfully",
                                status: 1,
                            };
                            return res.status(200).json({ error: [], result });
                        }
                    });
                } else {
                    // Create new settings
                    const insertQuery = "INSERT INTO transaction_settings (daily_limit, minimum_redeem_limit, maximum_redeem_limit, transaction_charges, updated_at) VALUES (?, ?, ?, ?, NOW())";
                    executeQuery({
                        query: insertQuery,
                        data: [daily_limit, minimum_redeem_limit, maximum_redeem_limit, transaction_charges],
                        callback: (err, insertData) => {
                            if (err)
                                return res
                                .status(500)
                                .json({ error: [{ message: err }], result: {} });

                            const result = {
                                message: "Transaction settings created successfully",
                                status: 1,
                            };
                            return res.status(200).json({ error: [], result });
                        }
                    });
                }
            }
        });
    } 
    catch (err) {
        console.error("Error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}


