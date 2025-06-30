import { executeQuery } from "../../utils/run_query.js";


export const createCard = (req, res) => { 

    try {
        const { card_type_name, card_type_e_point, card_type_w_point, card_type_status , card_profit_margin} = req.body;
        if (!card_type_name || !card_type_e_point || !card_type_w_point || !card_type_status || !card_profit_margin)
            return res
              .status(404)
              .json({ error: [{ message: "Input data missing" }], result: {} });

            const query =
          "INSERT INTO card_type (card_type_name, card_type_e_point, card_type_w_point, card_type_status, card_profit_margin) VALUES (?, ?, ?,?,?)";

            executeQuery({
            query,
            data: [card_type_name, card_type_e_point, card_type_w_point, card_type_status,card_profit_margin],
            callback: (err, cardData) => {
                    console.log(cardData)

                    if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                        const result = {
                            message: "Successfuly Created",
                            status: 1,
                            // data: userData
                            data: cardData,
                        };
        
                        return res.status(200).json({ error: [], result });

                }
            });
          
        
    } catch (error) {
        console.log(error.message);
        return res
          .status(500)
          .json({ error: [{ message: "Internal server error" }], result: {} });
    }
}

export const getCardDetails = (req, res) => { 

    try 
    {

        const query = "SELECT * FROM card_type";
        executeQuery({
        query,
        data: [],
        callback: (err, cardData) => {
            console.log(cardData)
            if (cardData.length > 0)
            {
                const result = {
                message: "successful",
                status:1,
                // data: userData
                data: cardData,
                };
                return res.status(200).json({ error: [], result });
            }
            else
            {
                return res
                .status(200)
                .json({
                    error: [{ message: "Cards not found" }],
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