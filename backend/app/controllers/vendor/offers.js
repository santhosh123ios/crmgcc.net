import { executeQuery } from "../../utils/run_query.js";

export const addOffers = (req, res) => {
    console.log("SANTHOSH IS IS : ");
    try {
       const {title,description, image, discount, discount_code, start_date,end_date} = req.body;
       const vendor_id = req.user?.id;
        console.log("SANTHOSH IS IS : "+vendor_id);

        if (!title || !description || !discount || !discount_code || !start_date || !image || !end_date)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

            const query = "SELECT * FROM offers WHERE title = ? AND vendor_id = ?";
            executeQuery({
                query,
                data: [title,vendor_id],
                callback: (err, prodData) => 
                {
                    if (prodData[0])
                    {
                        return res
                        .status(404)
                        .json({ error: [{ message: "this offer is already exist" }], result: {} });
                    }
                    else
                    {
                        const query = "INSERT INTO offers (title, description, image, discount, discount_code, vendor_id, start_date, end_date)VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                        executeQuery({
                                    query,
                                    data: [title,description, image, discount, discount_code, vendor_id,start_date,end_date],
                                    callback: (err, prodInData) => {
                                        console.log("SANTHOSH offer Error:", err);
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "add offer successfuly",
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

export const getOffers = (req, res) => {

    try {
        const vendor_id = req.user?.id;
        const query =  "SELECT * FROM  offers WHERE vendor_id = ?";
        
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
                        const query = "UPDATE offers SET status = ?, updated_at = NOW() WHERE id = ?";
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

export const updateOfferImage = (req, res) => {
    
    try {
       const {image,id} = req.body;

        if (!image || !id)
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
                        .json({ error: [{ message: "this product is no exist" }], result: {} });
                    }
                    else
                    {
                        const query = "UPDATE offers SET image = ?, updated_at = NOW() WHERE id = ?";
                        executeQuery({
                                    query,
                                    data: [image,id],
                                    callback: (err, prodInData) => {
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "update offer image successfuly",
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

export const updateOfferDetails = (req, res) => {
    
    try {
       const {title,description, discount, discount_code, start_date,end_date,id} = req.body;
       console.log(req.body)

        if (!title || !description|| !discount|| !discount_code|| !start_date || !end_date || !id)
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
                        const query = "UPDATE offers SET title = ?, description = ?, discount = ?, discount_code = ?, start_date = ?, end_date = ?, updated_at = NOW() WHERE id = ?";
                        executeQuery({
                                    query,
                                    data: [title,description, discount, discount_code, start_date, end_date, id],
                                    callback: (err, prodInData) => {
                                        console.log(err)
                                    if (err)
                                        return res
                                        .status(500)
                                        .json({ error: [{ message: err }], result: {} });

                                        const result = {
                                            message: "update offer details successfuly",
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

export const deleteOffer = (req, res) => {
    
    try {
       const {id} = req.body;

        if (!id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

        const query = "DELETE FROM offers WHERE id = ?";
        executeQuery({
            query,
            data: [id],
            callback: (err, resultData) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                const result = {
                    message: "Offer deleted successfully",
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