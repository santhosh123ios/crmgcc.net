import { executeQuery } from "../../utils/run_query.js";


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

export const getTransaction = (req, res) => {

    try {
        const user_id = req.user?.id;
        const query =  "SELECT transaction.*, users.name AS member_name, users.email AS member_email, users.profile_img AS member_image FROM  transaction LEFT JOIN  users  ON  transaction.user_id = users.id WHERE transaction.vendor_id = ?";
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