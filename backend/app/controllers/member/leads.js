import { executeQuery } from "../../utils/run_query.js";


export const vendorList = (req, res) => {
    try
    {
        
        const query = "SELECT * FROM users WHERE user_type = ?";
        executeQuery({
            query,
            data: [3],
            callback: (err, userData) => 
            {
              console.log(userData);
              // if (err) return res.status(500).json(err)
              if (!userData[0])
                return res
                  .status(400)
                  .json({
                    error: [{ message: "Brands not available" }],
                    result: {},
                  });
      
                console.log(userData);
                const result = {
                    message: "successful",
                    title: "",
                    status: 1,
                    // data: userData
                    data: userData,
                };
                return res.status(200).json({ error: [], result });
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


export const createLeads = (req, res) => {

    try {
        const { lead_name, lead_description, vendor_id, lead_file } = req.body;
        const user_id = req.user?.id;

        const query = "INSERT INTO leads (user_id, lead_name, lead_description, vendor_id, lead_file) VALUES (?, ?, ?, ?, ?)";
        executeQuery({
            query,
            data: [user_id, lead_name, lead_description, vendor_id, lead_file],
            callback: (err, userData) => 
            {
                if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                    const result = {
                            message: "lead created successfuly",
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



export const getLeads = (req, res) => {


    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "
        console.log(token)
        const user_id = req.user?.id;
        //const query = "SELECT * FROM leads WHERE user_id = ?";
        const query =  "SELECT leads.*, users.name AS vendor_name, users.email AS vendor_email, users.profile_img AS vendor_image FROM  leads LEFT JOIN  users  ON  leads.vendor_id = users.id WHERE leads.user_id = ? ORDER BY leads.created_at DESC";
        
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

export const getLeadMessage = (req, res) => {

    try {
        const {lead_id} = req.body;
        const query = "SELECT * FROM lead_message WHERE lead_id = ?";
        
        executeQuery({
            query,
            data: [lead_id],
            callback: (err, leadMessage) => 
            {
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

export const createLeadMessage = (req, res) => {

    try {
        const { text, lead_id } = req.body;
        const user_id = req.user?.id;
        
        const query = "INSERT INTO lead_message (text, sender, lead_id) VALUES (?, ?, ?)";
        executeQuery({
            query,
            data: [text, user_id, lead_id],
            callback: (err, userData) => 
            {
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