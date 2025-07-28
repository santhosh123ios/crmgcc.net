import { executeQuery } from "../../utils/run_query.js";

export const getAllProduct = (req, res) => {

    try {
        const vendor_id = req.user?.id;
        const query = "SELECT * FROM  product";

        executeQuery({
            query,
            data: [vendor_id],
            callback: (err, productData) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                const result = {
                    message: "get all product",
                    status: 1,
                    // data: userData
                    data: productData,
                };

                return res.status(200).json({ error: [], result });
            }
        })
    }
    catch (err) {
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}