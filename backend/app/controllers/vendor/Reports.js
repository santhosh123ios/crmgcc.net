import { executeQuery } from "../../utils/run_query.js";

export const getDashboard = (req, res) => {
    try
    {
        const id = req.user?.id;
        const query = "SELECT * FROM users WHERE user_type = ?";
        executeQuery({
            query,
            data: [2],
            callback: (err, memberData) => 
            {
                if (err)
                return res
                .status(500)
                .json({ error: [{ message: err }], result: {} });
      
               
                const query = "SELECT * FROM users WHERE user_type = ?";
                executeQuery({
                    query,
                    data: [3],
                    callback: (err, vendorData) => 
                    {
                    if (err)
                    return res
                    .status(500)
                    .json({ error: [{ message: err }], result: {} });
            
                        const query = "SELECT * FROM leads";
                        executeQuery({
                            query,
                            data: [],
                            callback: (err, leadsData) => 
                            {
                                if (err)
                                return res
                                .status(500)
                                .json({ error: [{ message: err }], result: {} });
                    
                                const query = "SELECT * FROM transaction";
                                executeQuery({
                                    query,
                                    data: [],
                                    callback: (err, transactionData) => 
                                    {
                                        if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });


                                        const query = "SELECT * FROM category";
                                        executeQuery({
                                            query,
                                            data: [],
                                            callback: (err, categoryListData) => 
                                            {
                                                if (err)
                                                return res
                                                .status(500)
                                                .json({ error: [{ message: err }], result: {} });

                                                const query = "SELECT * FROM vendor_category WHERE vendor_id = ?";
                                                executeQuery({
                                                    query,
                                                    data: [id],
                                                    callback: (err, catData) => 
                                                    {
                                                        if (err)
                                                        return res
                                                        .status(500)
                                                        .json({ error: [{ message: err }], result: {} });


                                                        const query = `SELECT WEEK(transaction_created_at, 3) - WEEK(DATE_FORMAT(transaction_created_at, '%Y-%m-01'), 3) + 1 AS week_number,
                                                        SUM(transaction_cr) AS total_credit,
                                                        SUM(transaction_dr) AS total_debit,
                                                        COUNT(*) AS total_transactions
                                                    FROM 
                                                        transaction
                                                    WHERE 
                                                        MONTH(transaction_created_at) = MONTH(CURRENT_DATE()) 
                                                        AND YEAR(transaction_created_at) = YEAR(CURRENT_DATE())
                                                    GROUP BY 
                                                        week_number
                                                    ORDER BY 
                                                        week_number`;
                                                    executeQuery({
                                                        query,
                                                        data: [],
                                                        callback: (err, transactionRepData) => 
                                                        {
                                                            if (err)
                                                            return res
                                                            .status(500)
                                                            .json({ error: [{ message: err }], result: {} });
                                                
                                                            const query = `SELECT WEEK(created_at, 3) - WEEK(DATE_FORMAT(created_at, '%Y-%m-01'), 3) + 1 AS week_number,
                                                                    COUNT(*) AS total_leads
                                                                FROM 
                                                                    leads
                                                                WHERE 
                                                                    MONTH(created_at) = MONTH(CURRENT_DATE()) 
                                                                    AND YEAR(created_at) = YEAR(CURRENT_DATE())
                                                                GROUP BY 
                                                                    week_number
                                                                ORDER BY 
                                                                    week_number`;
                                                                executeQuery({
                                                                        query,
                                                                        data: [],
                                                                        callback: (err, leadsRepData) => 
                                                                        {
                                                                            if (err)
                                                                            return res
                                                                            .status(500)
                                                                            .json({ error: [{ message: err }], result: {} });
                                                                
                                                                            const query = `SELECT 
                                                                                    u.id AS vendor_id,
                                                                                    u.name AS vendor_name,
                                                                                    COUNT(l.id) AS lead_count
                                                                                FROM users u
                                                                                JOIN leads l ON l.vendor_id = u.id
                                                                                WHERE u.user_type = 3
                                                                                GROUP BY u.id, u.name
                                                                                ORDER BY lead_count DESC
                                                                                LIMIT 5`;
                                                                            executeQuery({
                                                                                query,
                                                                                data: [],
                                                                                callback: (err, vendorsRepData) => 
                                                                                {
                                                                                    if (err)
                                                                                    return res
                                                                                    .status(500)
                                                                                    .json({ error: [{ message: err }], result: {} });
                                                                        
                                                                                    const result = {
                                                                                        message: "successful",
                                                                                        status: 1,
                                                                                        member_total: memberData.length,
                                                                                        member_total: memberData.length,
                                                                                        vendor_total: vendorData.length,
                                                                                        leads_total: leadsData.length,
                                                                                        transaction_total: transactionData.length,
                                                                                        transaction_report: transactionRepData,
                                                                                        leads_report: leadsRepData,
                                                                                        vendors_report: vendorsRepData,
                                                                                        catData : catData,
                                                                                        categorys : categoryListData
                                                                                        
                                                                                    };
                                                                                    console.log(categoryListData);
                                                                                    return res.status(200).json({ error: [], result });
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            })

                                                            }
                                                        })

                                                    }
                                                })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
    catch(error)
    {
        console.log(error.message);
        return res
          .status(500)
          .json({ error: [{ message: "Internal server error" }], result: {} });
    }

}