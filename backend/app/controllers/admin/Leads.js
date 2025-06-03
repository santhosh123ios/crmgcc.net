import { executeQuery } from "../../utils/run_query.js";

export const getLeads = (req, res) => {

    try {
        const user_id = req.user?.id;
        const query =  "SELECT leads.*, users.name AS member_name, users.email AS member_email, users.profile_img AS member_image FROM  leads LEFT JOIN  users  ON  leads.user_id = users.id";
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
                            message: "get all leads",
                            status: 1,
                            // data: userData
                            data: userData,
                    };
        
                    return res.status(200).json({ error: [], result });
            }
        })
    } 
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const leadStatusUpdate = (req, res) => {

    try {
        const { id, lead_status} = req.body;
        
        if (!id || !lead_status)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });


        const query = "UPDATE leads SET lead_status = ? WHERE id = ?";
        executeQuery({
            query,
            data: [lead_status,id],
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