import { executeQuery } from "../../utils/run_query.js";

export const createCategory = (req, res) => { 

    try {
        const { name } = req.body;
        if (!name)
            return res
              .status(404)
              .json({ error: [{ message: "Input data missing" }], result: {} });


        const query = "SELECT * FROM category WHERE name = ?";
        executeQuery({
        query,
        data: [name],
        callback: (err, catData) => {
            console.log(catData)
            if (catData[0])
                return res
                  .status(400)
                  .json({
                    error: [{ message: "this category already exists" }],
                    result: {},
                  });


            const query = "INSERT INTO category (name) VALUES (?)";
            executeQuery({
            query,
            data: [name],
            callback: (err, catInData) => {
                    console.log(catInData)

                    if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                    const result = {
                        message: "Successfuly Created The Category",
                        status: 1,
                        // data: userData
                        data: catInData,
                    };
                    return res.status(200).json({ error: [], result });

                }
            });


        }})

    } catch (error) {
        console.log(error.message);
        return res
          .status(500)
          .json({ error: [{ message: "Internal server error" }], result: {} });
    }
}

export const getCategorys = (req, res) => { 

    try 
    {

        const query = "SELECT * FROM category";
        executeQuery({
        query,
        data: [],
        callback: (err, catData) => {
            console.log(catData)
            if (catData.length > 0)
            {
                const result = {
                message: "successful",
                status:1,
                // data: userData
                data: catData,
                };
                return res.status(200).json({ error: [], result });
            }
            else
            {
                return res
                .status(200)
                .json({
                    error: [{ message: "Category not found" }],
                    result: {},
                });
            }

        }
        });
          
        
    } catch (error) {
        console.log(error.message);
        return res
          .status(500)
          .json({ error: [{ message: "Internal server error" }], result: {} });
    }
}

export const updateCategory = (req, res) => { 

    try {
        const { id, status } = req.body;
        console.log("THE STATUS IS : "+status)
        console.log("THE IS IS : "+id)
        if (!id)
            
            return res
              .status(404)
              .json({ error: [{ message: "Input data missing" }], result: {} });


        const query = "SELECT * FROM category WHERE id = ?";
        executeQuery({
        query,
        data: [id],
        callback: (err, catData) => {
            console.log(catData)
             console.log("THE IS IS : "+catData)
            if (catData[0])
            {
                const query = "UPDATE category SET status = ? WHERE id = ?";
                executeQuery({
                query,
                data: [status,id],
                callback: (err, catInData) => {
                        console.log(catInData)

                        if (err)
                            return res
                            .status(500)
                            .json({ error: [{ message: err }], result: {} });

                        const result = {
                            message: "Successfuly Updated The Category",
                            status: 1,
                            // data: userData
                            data: catInData,
                        };
                        return res.status(200).json({ error: [], result });

                    }
                });
            }
            else
            {
                return res
                  .status(400)
                  .json({
                    error: [{ message: "this category not exists" }],
                    result: {},
                });
            }
        }})

    } catch (error) {
        console.log(error.message);
        return res
          .status(500)
          .json({ error: [{ message: "Internal server error" }], result: {} });
    }
}


export const editCategory = (req, res) => { 

    try {
        const { id, name } = req.body;
        console.log("THE STATUS IS : "+name)
        console.log("THE IS IS : "+id)
        if (!id || !name)
            
            return res
              .status(404)
              .json({ error: [{ message: "Input data missing" }], result: {} });

        const query = "SELECT * FROM category WHERE id = ?";
        executeQuery({
        query,
        data: [id],
        callback: (err, catData) => {
            console.log(catData)
             console.log("THE IS IS : "+catData)
            if (catData[0])
            {
                const query = "UPDATE category SET name = ? WHERE id = ?";
                executeQuery({
                query,
                data: [name,id],
                callback: (err, catInData) => {
                        console.log(catInData)

                        if (err)
                            return res
                            .status(500)
                            .json({ error: [{ message: err }], result: {} });

                        const result = {
                            message: "Successfuly Updated The Category",
                            status: 1,
                            data: catInData,
                        };
                        return res.status(200).json({ error: [], result });

                    }
                });
            }
            else
            {
                return res
                  .status(400)
                  .json({
                    error: [{ message: "this category not exists" }],
                    result: {},
                });
            }
        }})

    } catch (error) {
        console.log(error.message);
        return res
          .status(500)
          .json({ error: [{ message: "Internal server error" }], result: {} });
    }
}