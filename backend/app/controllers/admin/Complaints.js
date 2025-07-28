import { executeQuery } from "../../utils/run_query.js";

export const getComplaints = (req, res) => {

    try {
        const user_id = req.user?.id;
        const query = "SELECT complaints.*, users.name AS vendor_name, users.email AS vendor_email, users.profile_img AS vendor_image FROM  complaints LEFT JOIN  users  ON  complaints.vendor_id = users.id";

        executeQuery({
            query,
            data: [user_id],
            callback: (err, userData) => {
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
        const { id, status } = req.body;

        if (!id || !status)
            return res
                .status(404)
                .json({ error: [{ message: "Input data missing" }], result: {} });


        const query = "UPDATE complaints SET status = ? WHERE id = ?";
        //UPDATE leads SET lead_status = ? WHERE id = ?
        executeQuery({
            query,
            data: [status, id],
            callback: (err, userData) => {
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


export const getComplaintMessage = (req, res) => {

    try {
        const { complaint_id } = req.body;
        const query = "SELECT * FROM complaint_message WHERE complaint_id = ?";

        executeQuery({
            query,
            data: [complaint_id],
            callback: (err, leadMessage) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                const result = {
                    message: "get the lead message",
                    status: 1,
                    // data: userData
                    data: leadMessage,
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

export const createComplaintMessage = (req, res) => {

    try {
        const { text, complaint_id } = req.body;
        const user_id = req.user?.id;

        const query = "INSERT INTO complaint_message (text, sender, complaint_id) VALUES (?, ?, ?)";
        executeQuery({
            query,
            data: [text, user_id, complaint_id],
            callback: (err, userData) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                const result = {
                    message: "lead message created successfuly",
                    title: "",
                    status: 1,
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