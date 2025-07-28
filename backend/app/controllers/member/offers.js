import { executeQuery } from "../../utils/run_query.js";

export const getAllOffers = (req, res) => {

    try {
        const vendor_id = req.user?.id;
        const query = "SELECT * FROM  offers";

        executeQuery({
            query,
            data: [vendor_id],
            callback: (err, productData) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                const result = {
                    message: "get all offers",
                    status: 1,
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