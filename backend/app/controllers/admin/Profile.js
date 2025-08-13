import { executeQuery } from "../../utils/run_query.js";

export const memberList = (req, res) => {
    try
    {
        
        const query = "SELECT * FROM users WHERE user_type = ?";
        executeQuery({
            query,
            data: [2],
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

export const updateProfileImage = (req, res) => {

    try {
        console.log("SANTHOSH : "+req.body)
        const user_id = req.user?.id;
        const {profile_img} = req.body;

        console.log("SANTHOSH IMG : "+profile_img)
        
        if (!user_id || !profile_img)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });


        const query = "UPDATE users SET profile_img = ? WHERE id = ?";
        executeQuery({
            query,
            data: [profile_img, user_id],
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

export const getProfile = (req, res) => {

    try {
        const user_id = req.user?.id;
        const query = "SELECT u.id, u.name, u.phone, u.profile_img, u.password, u.created_at, u.email, u.email_verification, u.phone_verification, u.user_type, u.status, m.dob, m.gender, m.address, m.job, m.ac_no, m.iban_no, m.bank_name, m.updated_at FROM  users u LEFT JOIN  member_info m ON u.id = m.user_id WHERE u.id = ?";
        executeQuery({
            query,
            data: [user_id],
            callback: (err, profileData) => 
            {
                if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                        console.log("SANTHOOO : "+profileData[0])
                   const result = {
                            message: "Get all User Profile",
                            status: 1,
                            data: profileData[0],
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

export const updateProfile = (req, res) => {

    try {
        
        const user_id = req.user?.id;
        const {name, phone, password,dob, gender, address, job, ac_no, iban_no, bank_name} = req.body;

        console.log("SANTHOSH : "+name)
        
        if (!user_id || !name || !phone || !password)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

        const query = "UPDATE users SET name = ?, phone = ?, password = ? WHERE id = ?";
        executeQuery({
            query,
            data: [name, phone, password, user_id],
            callback: (err, userData) => 
            {
               
                if (err)
                return res
                .status(500)
                .json({ error: [{ message: err }], result: {} });


                const query = "SELECT COUNT(*) AS count FROM member_info WHERE user_id = ?";
                executeQuery({
                query,
                data: [user_id],
                callback: (err, rows) => 
                {
                    if (rows[0].count > 0) 
                    {
                        const query = "UPDATE member_info SET dob = ?, gender = ?, address = ?, job = ?, ac_no = ?, iban_no = ?, bank_name = ?, updated_at = NOW() WHERE user_id = ?";
                        executeQuery({
                            query,
                            data: [dob, gender, address, job, ac_no, iban_no, bank_name, user_id],
                            callback: (err, userData) => 
                            {
                                console.log("SANTHOSH error : "+err)
                                if (err)
                                return res
                                .status(500)
                                .json({ error: [{ message: err }], result: {} });


                                const result = {
                                    message: "Updated successfully",
                                    status: 1,
                                };
                                return res.status(200).json({ error: [], result });

                            } 
                        })
                    }
                    else
                    {
                        const query = "INSERT INTO member_info (dob, gender, address, job, ac_no, iban_no, bank_name, user_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
                        executeQuery({
                            query,
                            data: [dob, gender, address, job, ac_no, iban_no, bank_name, user_id],
                            callback: (err, userData) => 
                            {
                                console.log("SANTHOSH 2 error : "+err)
                                if (err)
                                return res
                                .status(500)
                                .json({ error: [{ message: err }], result: {} });


                                const result = {
                                    message: "Updated successfully",
                                    status: 1,
                                };
                                return res.status(200).json({ error: [], result });

                            } 
                        })
                    }

                }})
            }
        })
    } 
    catch (err) {
        console.error("error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}

export const userBankInfo = (req, res) => {
    try {

        const {user_id} = req.body;
        
        if (!user_id) {
            return res
                .status(404)
                .json({ error: [{ message: "User ID not found" }], result: {} });
        }

        const query = "SELECT ac_no, iban_no, bank_name FROM member_info WHERE user_id = ?";
        executeQuery({
            query,
            data: [user_id],
            callback: (err, bankData) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });
                }

                let bankInfo = {
                    ac_no: null,
                    iban_no: null,
                    bank_name: null,
                    has_bank_info: false
                };

                if (bankData && bankData.length > 0) {
                    const data = bankData[0];
                    bankInfo = {
                        ac_no: data.ac_no || null,
                        iban_no: data.iban_no || null,
                        bank_name: data.bank_name || null,
                        has_bank_info: !!(data.ac_no && data.iban_no && data.bank_name)
                    };
                }

                const result = {
                    message: "Bank information status retrieved successfully",
                    status: 1,
                    data: bankInfo
                };

                return res.status(200).json({ error: [], result });
            }
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
};