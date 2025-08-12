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

export const updateOfferStatus = (req, res) => {
    
    try {
       const {status,id} = req.body;

        if (!id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

            const query = "SELECT * FROM offers WHERE id = ?";
            executeQuery({
                query,
                data: [id],
                callback: (err, prodData) => 
                {
                    if (!prodData[0])
                    {
                        return res
                        .status(404)
                        .json({ error: [{ message: "this offer is no exist" }], result: {} });
                    }
                    else
                    {
                        const query = "UPDATE offers SET status = ?, created_at = NOW() WHERE id = ?";
                        executeQuery({
                                    query,
                                    data: [status,id],
                                    callback: (err, prodInData) => {
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "update product status successful",
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


export const updateProductStatus = (req, res) => {
    
    try {
       const {status,id} = req.body;

        if (!id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

            const query = "SELECT * FROM product WHERE id = ?";
            executeQuery({
                query,
                data: [id],
                callback: (err, prodData) => 
                {
                    if (!prodData[0])
                    {
                        return res
                        .status(404)
                        .json({ error: [{ message: "this product is no exist" }], result: {} });
                    }
                    else
                    {
                        const query = "UPDATE product SET status = ?, updated_at = NOW() WHERE id = ?";
                        executeQuery({
                                    query,
                                    data: [status,id],
                                    callback: (err, prodInData) => {
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "update product status successful",
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