import { executeQuery } from "../../utils/run_query.js";

export const getAllTransaction = (req, res) => {

    try {
       //const user_id = req.user?.id;
       const query =  "SELECT t.transaction_id, t.transaction_type, t.transaction_cr, t.transaction_dr, t.transaction_title, t.transaction_created_at, t.user_id, t.from_id, t.to_id, t.card_id, t.card_no,  from_user.name AS from_name, from_user.profile_img AS from_image, from_user.user_type AS from_type,  to_user.name AS to_name, to_user.email AS to_email, to_user.profile_img AS to_image, to_user.user_type AS to_type FROM `transaction` t  LEFT JOIN `users` AS from_user ON t.from_id = from_user.id LEFT JOIN `users` AS to_user ON t.to_id = to_user.id ORDER BY t.transaction_created_at DESC";
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


export const addAdminTopup = (req, res) => {

    try {
       const {transaction_point} = req.body;
       const user_id = req.user?.id;
        
        if ( !transaction_point || !user_id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

        const query = `INSERT INTO transaction (transaction_type,transaction_cr,transaction_dr,transaction_title,user_id,from_id,to_id,
          card_id,card_no ) SELECT ?, ?, ?, ?, ?, ?, ?, c.card_id, c.card_no FROM cards c WHERE c.user_id = ? LIMIT 1;`;
        executeQuery({
            query,
            data: [ 1, transaction_point, 0, "Admin Topup",user_id,user_id,user_id,user_id],
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
        const { daily_limit, minimum_redeem_limit, maximum_redeem_limit, transaction_charges, transaction_expiry_time } = req.body;
        
        if (!daily_limit || !minimum_redeem_limit || !maximum_redeem_limit || !transaction_charges || !transaction_expiry_time)
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
                    const updateQuery = "UPDATE transaction_settings SET daily_limit = ?, minimum_redeem_limit = ?, maximum_redeem_limit = ?, transaction_charges = ?, transaction_expiry_time = ?, updated_at = NOW() WHERE id = ?";
                    executeQuery({
                        query: updateQuery,
                        data: [daily_limit, minimum_redeem_limit, maximum_redeem_limit, transaction_charges, transaction_expiry_time, existingData[0].id],
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
                    const insertQuery = "INSERT INTO transaction_settings (daily_limit, minimum_redeem_limit, maximum_redeem_limit, transaction_charges, transaction_expiry_time, updated_at) VALUES (?, ?, ?, ?, ?, NOW())";
                    executeQuery({
                        query: insertQuery,
                        data: [daily_limit, minimum_redeem_limit, maximum_redeem_limit, transaction_charges, transaction_expiry_time],
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

export const get_wallet = (req, res) => {
    try {
        const user_id = req.user?.id;
        
        if (!user_id) {
            return res
                .status(404)
                .json({ error: [{ message: "User ID missing" }], result: {} });
        }

        // Get card details with card type information
        const cardQuery = `
            SELECT 
                c.card_id,
                c.card_no,
                c.card_status,
                c.user_id,
                ct.card_type_name AS card_type
            FROM cards c 
            LEFT JOIN card_type ct ON c.card_type_id = ct.card_type_id 
            WHERE c.user_id = ?
        `;

        executeQuery({
            query: cardQuery,
            data: [user_id],
            callback: (err, cardData) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });
                }

                // Get balance points (sum of credits minus debits)
                const balanceQuery = "SELECT SUM(transaction_cr) - SUM(transaction_dr) AS balance_point FROM transaction WHERE user_id = ?";
                
                executeQuery({
                    query: balanceQuery,
                    data: [user_id],
                    callback: (err, balanceData) => {
                        if (err) {
                            return res
                                .status(500)
                                .json({ error: [{ message: err }], result: {} });
                        }

                        // Get total points sum (sum of all credits)
                        const totalPointsQuery = "SELECT SUM(transaction_cr) - SUM(transaction_dr) AS total_point_sum FROM transaction";
                        //const totalPointsQuery = "SELECT SUM(transaction_cr) AS total_point_sum FROM transaction";
                        
                        executeQuery({
                            query: totalPointsQuery,
                            data: [],
                            callback: (err, totalPointsData) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });
                                }

                                const result = {
                                    message: "Get wallet details successful",
                                    status: 1,
                                    data: {
                                        card: cardData[0] || null,
                                        balance_point: balanceData[0]?.balance_point || 0,
                                        total_point_sum: totalPointsData[0]?.total_point_sum || 0
                                    }
                                };

                                return res.status(200).json({ error: [], result });
                            }
                        });
                    }
                });
            }
        });
    } 
    catch (err) {
        console.error("Error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}


