import { executeQuery } from "../../utils/run_query.js";

export const createComplaint = (req, res) => {

    try {
        const { vendor_id, subject, message, attachment } = req.body;
        const user_id = req.user?.id;
        const query = "INSERT INTO complaints (vendor_id,user_id, subject, message, attachment) VALUES (?, ?, ?, ?, ?)";
        executeQuery({
            query,
            data: [vendor_id, user_id, subject, message, attachment],
            callback: (err, userData) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                const result = {
                    message: "complaint created successfuly",
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

export const getComplaints = (req, res) => {

    try {
        const user_id = req.user?.id;
        //const query = "SELECT complaints.*, users.name AS vendor_name, users.email AS vendor_email, users.profile_img AS vendor_image FROM  complaints LEFT JOIN  users  ON  complaints.vendor_id = users.id WHERE complaints.user_id = ?";
        const query = "SELECT complaints.*, vendor.name AS vendor_name, vendor.email AS vendor_email, vendor.profile_img AS vendor_image,member.name AS member_name,member.email AS member_email, member.profile_img AS member_image FROM complaints LEFT JOIN users AS vendor ON complaints.vendor_id = vendor.id LEFT JOIN users AS member ON complaints.user_id = member.id WHERE complaints.user_id = ?";

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