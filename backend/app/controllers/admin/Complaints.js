import { executeQuery } from "../../utils/run_query.js";

export const getComplaints = (req, res) => {

    try {
        const user_id = req.user?.id;
        const query =  "SELECT complaints.*, users.name AS vendor_name, users.email AS vendor_email, users.profile_img AS vendor_image FROM  complaints LEFT JOIN  users  ON  complaints.vendor_id = users.id";
        
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
                            message: "get all complaints",
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

export const complaintsStatusUpdate = (req, res) => {

    try {
        const { id, status} = req.body;
        
        if (!id || !status)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });


        const query = "UPDATE complaints SET status = ? WHERE id = ?";
        //UPDATE leads SET lead_status = ? WHERE id = ?
        executeQuery({
            query,
            data: [status, id],
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