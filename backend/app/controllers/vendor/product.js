import { executeQuery } from "../../utils/run_query.js";

export const addProduct = (req, res) => {
    console.log("SANTHOSH IS IS : ");
    try {
       const { title,description, price, offer_price,image} = req.body;
       const vendor_id = req.user?.id;
        console.log("SANTHOSH IS IS : "+vendor_id);

        if (!title || !description || !price || !offer_price || !image)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

            const query = "SELECT * FROM product WHERE title = ? AND vendor_id = ?";
            executeQuery({
                query,
                data: [title,vendor_id],
                callback: (err, prodData) => 
                {
                    if (prodData[0])
                    {
                        return res
                        .status(404)
                        .json({ error: [{ message: "this product is already exist" }], result: {} });
                    }
                    else
                    {
                        const query = "INSERT INTO product (title,description, price, offer_price, vendor_id, image) VALUES (?,?,?,?,?,?)";
                        executeQuery({
                                    query,
                                    data: [title,description, price, offer_price,vendor_id,image],
                                    callback: (err, prodInData) => {
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "add product successful",
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


export const getProduct = (req, res) => {

    try {
        const vendor_id = req.user?.id;
        const query =  "SELECT * FROM  product WHERE vendor_id = ?";
        
        executeQuery({
            query,
            data: [vendor_id],
            callback: (err, productData) => 
            {
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

export const updateProductImage = (req, res) => {
    
    try {
       const {image,id} = req.body;

        if (!image || !id)
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
                        const query = "UPDATE product SET image = ?, updated_at = NOW() WHERE id = ?";
                        executeQuery({
                                    query,
                                    data: [image,id],
                                    callback: (err, prodInData) => {
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "update product image successful",
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


export const updateProductDetails = (req, res) => {
    
    try {
       const {title,description, price, offer_price,id} = req.body;

        if (!title || !description|| !price|| !offer_price|| !id)
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
                        const query = "UPDATE product SET title = ?,description = ?, price = ?, offer_price = ?, updated_at = NOW() WHERE id = ?";
                        executeQuery({
                                    query,
                                    data: [title,description, price, offer_price,id],
                                    callback: (err, prodInData) => {
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "update product details successfuly",
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


export const deleteProduct = (req, res) => {
    
    try {
       const {id} = req.body;

        if (!id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

        const query = "DELETE FROM product WHERE id = ?";
        executeQuery({
            query,
            data: [id],
            callback: (err, resultData) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                const result = {
                    message: "Product deleted successfully",
                    status: 1
                };
                return res.status(200).json({ error: [], result });
            }
        });

    } 
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ status: 0, message: "Server error", error: err.message });
    }
}