import { executeQuery } from "../../utils/run_query.js";


// export const addTransactionOld = (req, res) => {

//     try {
//        const { transaction_type, transaction_title, transaction_point, to_id } = req.body;
//        const user_id = req.user?.id;
        
//         if (!transaction_type || !transaction_point || !transaction_title || !user_id || !to_id)
//         return res
//           .status(404)
//           .json({ error: [{ message: "Input data missing" }], result: {} });

//         let transaction_cr = 0;
//         let transaction_dr = 0;
//         if (transaction_type == 1)
//         {
//             transaction_cr = transaction_point;
//             transaction_dr = 0;
//         }
//         else
//         {
//             transaction_cr = 0;
//             transaction_dr = transaction_point;
//         }
//         const query = `INSERT INTO transaction (transaction_type,transaction_cr,transaction_dr,transaction_title,user_id,vendor_id,
//                         card_id,card_no ) SELECT ?, ?, ?, ?, ?,?, c.card_id, c.card_no FROM cards c WHERE c.user_id = ? LIMIT 1;`;
//         executeQuery({
//                     query,
//                     data: [ transaction_type, transaction_cr, transaction_dr, transaction_title,member_id,user_id,member_id],
//                     callback: (err, trData) => {
//                     if (err)
//                         return res
//                         .status(500)
//                         .json({ error: [{ message: err }], result: {} });

//                         const result = {
//                             message: "add transaction successful",
//                             status: 1
//                         };
//                         return res.status(200).json({ error: [], result });
//                     }
//         });
//     } 
//     catch (err) {
//         console.error("Upload error:", err);
//         res.status(500).json({ status: 0, message: "Server error", error: err.message });
//     }
// }

export const addTransaction = (req, res) => {

    try {
       const { transaction_title, transaction_point, to_id } = req.body;
       const user_id = req.user?.id;
        
        if (!transaction_point || !transaction_title || !user_id || !to_id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

        // First get transaction settings to calculate expiry date
        const settingsQuery = "SELECT transaction_expiry_time FROM transaction_settings ORDER BY id DESC LIMIT 1";
        executeQuery({
            query: settingsQuery,
            data: [],
            callback: (err, settingsData) => {
                if (err) {
                    return res
                    .status(500)
                    .json({ error: [{ message: err }], result: {} });
                }

                const expiryDays = settingsData[0]?.transaction_expiry_time || 30; // Default to 30 days if not set
                const currentDate = new Date();
                const expiryDate = new Date(currentDate.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
                const formattedExpiryDate = expiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

                // Check balance and proceed with transaction
                const balanceQuery = "SELECT COALESCE(SUM(transaction_cr), 0) - COALESCE(SUM(transaction_dr), 0) AS user_balance FROM transaction WHERE user_id = ?";
                executeQuery({
                    query: balanceQuery,
                    data: [user_id],
                    callback: (err, balanceData) => {
                        if (err)
                            return res
                            .status(500)
                            .json({ error: [{ message: err }], result: {} });

                        const currentBalance = parseFloat(balanceData[0]?.user_balance || 0);
                        const requiredPoints = parseFloat(transaction_point);
                        
                        console.log("Balance check - Available:", currentBalance, "Required:", requiredPoints, "Type - Available:", typeof currentBalance, "Required:", typeof requiredPoints);
                        
                        if (currentBalance < requiredPoints) {
                            console.log("Insufficient points. Available: ", currentBalance, "Required: ", requiredPoints)
                            return res
                            .status(400)
                            .json({ 
                                error: [{ 
                                    message: `Insufficient points. Available: ${currentBalance}, Required: ${requiredPoints}` 
                                }], 
                                result: {} 
                            });
                        }
                        // Proceed with transaction if enough points
                        transactionDR(formattedExpiryDate);
                    }
                });
            }
        });

        function transactionDR(expiryDate) {
           
            const query = `INSERT INTO transaction (transaction_type,transaction_cr,transaction_dr,transaction_title,user_id,from_id,to_id,
                            card_id,card_no ) SELECT ?, ?, ?, ?, ?, ?, ?, c.card_id, c.card_no FROM cards c WHERE c.user_id = ? LIMIT 1;`;
            executeQuery({
                        query,
                        data: [ 2, 0, transaction_point, transaction_title,user_id,user_id,to_id, user_id],
                        callback: (err, trData) => {
                        if (err)
                            return res
                            .status(500)
                            .json({ error: [{ message: err }], result: {} });

                            transactionCR(expiryDate)
                        
                        }
            });
        }

        function transactionCR(expiryDate) {
            
            const query = `INSERT INTO transaction (transaction_type,transaction_cr,transaction_dr,transaction_title,user_id,from_id,to_id,
                            card_id,card_no,expire_on ) SELECT ?, ?, ?, ?, ?, ?, ?, c.card_id, c.card_no, ? FROM cards c WHERE c.user_id = ? LIMIT 1;`;
            executeQuery({
                        query,
                        data: [ 1, transaction_point, 0, transaction_title,to_id,user_id,to_id, expiryDate, to_id],
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
    } 
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}  

export const getTransaction = (req, res) => {

    try {
        const user_id = req.user?.id;
        const query =  "SELECT t.transaction_id, t.transaction_type, t.transaction_cr, t.transaction_dr, t.transaction_title, t.transaction_created_at, t.user_id, t.from_id, t.to_id, t.card_id, t.card_no,  from_user.name AS from_name, from_user.profile_img AS from_image, from_user.user_type AS from_type,  to_user.name AS to_name, to_user.email AS to_email, to_user.profile_img AS to_image, to_user.user_type AS to_type FROM `transaction` t  LEFT JOIN `users` AS from_user ON t.from_id = from_user.id LEFT JOIN `users` AS to_user ON t.to_id = to_user.id  WHERE t.user_id = ?";
        executeQuery({
            query,
            data: [user_id],
            callback: (err, userData) => 
            {
                console.log(userData)
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

                        const result = {
                            message: "Get wallet details successful",
                            status: 1,
                            data: {
                                card: cardData[0] || null,
                                balance_point: balanceData[0]?.balance_point || 0,
                            }
                        };

                        return res.status(200).json({ error: [], result });
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


export const add_vendor_topup = (req, res) => {

    try {
        const { transaction_point} = req.body;
        const user_id = req.user?.id;
         
         if (!transaction_point || !user_id)
         return res
           .status(404)
           .json({ error: [{ message: "Input data missing" }], result: {} });

        // First get transaction settings to calculate expiry date
        const settingsQuery = "SELECT transaction_expiry_time FROM transaction_settings ORDER BY id DESC LIMIT 1";
        executeQuery({
            query: settingsQuery,
            data: [],
            callback: (err, settingsData) => {
                if (err) {
                    return res
                    .status(500)
                    .json({ error: [{ message: err }], result: {} });
                }

                const expiryDays = settingsData[0]?.transaction_expiry_time || 30; // Default to 30 days if not set
                const currentDate = new Date();
                const expiryDate = new Date(currentDate.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
                const formattedExpiryDate = expiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

                // Check balance and proceed with transaction
                const balanceQuery = "SELECT COALESCE(SUM(transaction_cr), 0) - COALESCE(SUM(transaction_dr), 0) AS user_balance FROM transaction WHERE user_id = ?";
                executeQuery({
                    query: balanceQuery,
                    data: [1],
                    callback: (err, balanceData) => {
                        if (err)
                            return res
                            .status(500)
                            .json({ error: [{ message: err }], result: {} });

                        const currentBalance = parseFloat(balanceData[0]?.user_balance || 0);
                        const requiredPoints = parseFloat(transaction_point);
                        
                        if (currentBalance < requiredPoints) {
                            return res
                            .status(400)
                            .json({ 
                                error: [{ 
                                    message: `Insufficient points. Available: ${currentBalance}, Required: ${requiredPoints}` 
                                }], 
                                result: {} 
                            });
                        }
                        // Proceed with transaction if enough points
                        transactionDR(formattedExpiryDate);
                    }
                });
            }
        });
 
        function transactionDR(expiryDate) {
            
             const query = `INSERT INTO transaction (transaction_type,transaction_cr,transaction_dr,transaction_title,user_id,from_id,to_id,
                             card_id,card_no ) SELECT ?, ?, ?, ?, ?, ?, ?, c.card_id, c.card_no, ? FROM cards c WHERE c.user_id = ? LIMIT 1;`;
             executeQuery({
                         query,
                         data: [ 2, 0, transaction_point, "Vendor Topup",1,1,user_id, 1],
                         callback: (err, trData) => {
                         if (err)
                             return res
                             .status(500)
                             .json({ error: [{ message: err }], result: {} });

                             transactionCR(expiryDate)
                         
                         }
             });
        }
 
                  function transactionCR(expiryDate) {
             
             const query = `INSERT INTO transaction (transaction_type,transaction_cr,transaction_dr,transaction_title,user_id,from_id,to_id,
                             card_id,card_no ) SELECT ?, ?, ?, ?, ?, ?, ?, c.card_id, c.card_no, ? FROM cards c WHERE c.user_id = ? LIMIT 1;`;
             executeQuery({
                         query,
                         data: [ 1, transaction_point, 0, "Vendor Topup",user_id,1,user_id, user_id],
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
     } 
     catch (err) {
         console.error("Upload error:", err);
         res.status(500).json({ status: 0, message: "Server error", error: err.message });
     }
}

export const check_member_points = (req, res) => {
    try {
        const { card_no } = req.body;
        
        if (!card_no) {
            return res
                .status(400)
                .json({ error: [{ message: "Card number is required" }], result: {} });
        }

        // Get card details and user information including member details
        const cardQuery = `
            SELECT 
                c.user_id,
                c.card_status,
                c.card_no,
                u.name AS member_name,
                u.status AS member_status,
                u.phone AS member_number
            FROM cards c 
            LEFT JOIN users u ON c.user_id = u.id 
            WHERE c.card_no = ?
        `;
        
        executeQuery({
            query: cardQuery,
            data: [card_no],
            callback: (err, cardData) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });
                }

                if (!cardData || cardData.length === 0) {
                    return res
                        .status(404)
                        .json({ error: [{ message: "Card not found" }], result: {} });
                }

                const user_id = cardData[0].user_id;

                // Get the available points for the user
                const balanceQuery = "SELECT COALESCE(SUM(transaction_cr), 0) - COALESCE(SUM(transaction_dr), 0) AS available_points FROM transaction WHERE user_id = ?";
                
                executeQuery({
                    query: balanceQuery,
                    data: [user_id],
                    callback: (err, balanceData) => {
                        if (err) {
                            return res
                                .status(500)
                                .json({ error: [{ message: err }], result: {} });
                        }

                        const availablePoints = parseFloat(balanceData[0]?.available_points || 0);

                        const result = {
                            message: "Member points retrieved successfully",
                            status: 1,
                            data: {
                                card_no: card_no,
                                card_status: cardData[0].card_status,
                                user_id: user_id,
                                member_name: cardData[0].member_name,
                                member_status: cardData[0].member_status,
                                member_number: cardData[0].member_number,
                                available_points: availablePoints
                            }
                        };

                        return res.status(200).json({ error: [], result });
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