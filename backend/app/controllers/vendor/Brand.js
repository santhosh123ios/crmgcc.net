import { executeQuery } from "../../utils/run_query.js";

export const addVendorCategory = (req, res) => {

    try {
       const { id } = req.body;
       const user_id = req.user?.id;
        console.log("SANTHOSH IS IS : "+id);
        if (!id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

            const query = "SELECT * FROM vendor_category WHERE vendor_id = ?";
            executeQuery({
                query,
                data: [user_id],
                callback: (err, catData) => 
                {
                    if (catData[0])
                    {
                        return res
                        .status(404)
                        .json({ error: [{ message: "this vendor is already exist" }], result: {} });
                    }
                    else
                    {
                        const query = "INSERT INTO vendor_category (cat_id,vendor_id) VALUES (?, ?)";
                        executeQuery({
                                    query,
                                    data: [id,user_id],
                                    callback: (err, vendorCatData) => {
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "add vendor ategory successful",
                                            status: 1
                                        };
                                        return res.status(200).json({ error: [], result });
                                    }
                        });
                    }

                }
            })

    } 
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}