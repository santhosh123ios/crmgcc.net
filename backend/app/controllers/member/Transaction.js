import { executeQuery } from "../../utils/run_query.js";

export const getTransaction = (req, res) => {

    try {
        const user_id = req.user?.id;
        const query =  "SELECT t.transaction_id, t.transaction_type, t.transaction_cr, t.transaction_dr, t.transaction_title, t.transaction_created_at, t.user_id, t.from_id, t.to_id, t.card_id, t.card_no,  from_user.name AS from_name, from_user.profile_img AS from_image, from_user.user_type AS from_type,  to_user.name AS to_name, to_user.email AS to_email, to_user.profile_img AS to_image, to_user.user_type AS to_type FROM `transaction` t  LEFT JOIN `users` AS from_user ON t.from_id = from_user.id LEFT JOIN `users` AS to_user ON t.to_id = to_user.id  WHERE t.user_id = ? ORDER BY t.transaction_created_at DESC";
        executeQuery({
            query,
            data: [user_id],
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


export const addRedeem = (req, res) => {
    try {
       const {redeem_point,redeem_notes} = req.body;
       const user_id = req.user?.id;
        
        if (!redeem_point || !redeem_notes || !user_id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

        const query = "INSERT INTO redeems (member_id,point,notes) VALUES (?, ?, ?)";
        executeQuery({
                    query,
                    data: [ user_id, redeem_point, redeem_notes],
                    callback: (err, trData) => {
                    if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                        const result = {
                            message: "add redeem successful",
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


export const getRedeem = (req, res) => {

    try {
        const user_id = req.user?.id;
        const query = "SELECT * FROM redeems WHERE member_id = ? ORDER BY redeem_created_at DESC";
        executeQuery({
            query,
            data: [user_id],
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

export const getWalletDetails = (req, res) => {

    try {
        const user_id = req.user?.id;
        //const query = "SELECT * FROM cards WHERE user_id = ?";
        const query =  "SELECT cards.*, card_type.card_type_name AS card_type_name FROM  cards LEFT JOIN  card_type  ON  cards.card_type_id = card_type.card_type_id WHERE cards.user_id = ?";
        
        executeQuery({
            query,
            data: [user_id],
            callback: (err, cardData) => 
            {
                if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });


                        const query = "SELECT * FROM users WHERE id = ?";
                        executeQuery({
                            query,
                            data: [user_id],
                            callback: (err, userData) => 
                            {
                                if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        ///const query = "SELECT * FROM users WHERE id = ?";
                                        const query = "SELECT SUM(transaction_cr) - SUM(transaction_dr) AS user_balance FROM transaction WHERE user_id = ?";
                                        executeQuery({
                                            query,
                                            data: [user_id],
                                            callback: (err, userBalance) => 
                                            {
                                                if (err)
                                                        return res
                                                        .status(500)
                                                        .json({ error: [{ message: err }], result: {} });

                                                const result = {
                                                            message: "Get Wallet Details",
                                                            status: 1,
                                                            card: cardData[0],
                                                            user: userData[0],
                                                            available_point: userBalance[0]
                                                };
                                                return res.status(200).json({ error: [], result });


                                            }             
                                        });
                            }             
                        });      
            }
        })
    } 
    catch (err) {
        console.error("Error:", err);
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