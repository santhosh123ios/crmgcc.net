import { executeQuery } from "../../utils/run_query.js";
import { verifyToken } from "../../utils/jwtHelper.js";
import { sendVerificationEmail } from '../../services/emailService.js';
import dotenv from 'dotenv';
import Jwt from "jsonwebtoken";
dotenv.config();

export const register = (req, res) => {

    try
    {
        console.log(req.body);
        const { name, phone, password, email, user_type } = req.body;
        if (!name || !phone || !password || !email || !user_type)
            return res
              .status(404)
              .json({ error: [{ message: "Input data missing" }], result: {} });

        const query = "SELECT * FROM users WHERE phone = ?";
        executeQuery({
            query,
            data: [phone],
            callback: (err, userData) => 
            {
              console.log(userData);
              // if (err) return res.status(500).json(err)
              if (userData[0])
                return res
                  .status(400)
                  .json({
                    error: [{ message: "this user already exists" }],
                    result: {},
                  });
      
              console.log(userData);

              const query =
          "INSERT INTO users (name, phone, password, email, user_type, status) VALUES (?, ?, ?,?, ?, ?)";

                executeQuery({
                    query,
                    data: [name, phone, password, email, user_type, 1],
                    callback: (err, data) => {
                    // if (err) return res.status(500).json(err)
                    if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });
        
                    // const result = {
                    //     message: "",
                    //     title: "",
                    //     data: {}
                    // }
        
                    // return res.status(200).json({ error: [], result});
        
                    const query = "SELECT * FROM users WHERE phone = ?";
        
                    executeQuery({
                        query,
                        data: [phone],
                        callback: (err, userData) => {
                        // if (err) return res.status(500).json(err)
                        if (err)
                            return res
                            .status(500)
                            .json({ error: [{ message: err }], result: {} });
        
                        const result = {
                            message: "User data inserted",
                            title: "",
                            status: 1,
                            // data: userData
                            data: userData[0],
                        };
        
                        return res.status(200).json({ error: [], result });
                        },
                    });
                    },
                });
            }
        });


    }
    catch(error)
    {
        console.log(error.message);
        return res
          .status(500)
          .json({ error: [{ message: "Internal server error" }], result: {} });
    }


};


export const login = (req, res) => {

    try {
      console.log(req.body);
      const {password,email } = req.body;
console.log("santhosh Q");
console.log(email);
console.log(password);
  
      if (!password || !email) {
  console.log("santhosh B");
  return res.status(404).json({ error: [{ message: "Input data missing" }], result: {} });
}
          
  
	console.log("santhosh A");
      const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  
      executeQuery({
        query,
        data: [email, password],
        callback: (err, userData) => {
console.log("santhosh C");
            // if (err) return res.status(500).json(err)
            console.log(userData[0])
            if (userData[0]) {
              console.log("USER", userData[0].id);

              const query = "SELECT * FROM users WHERE email = ? AND email_verification = ?";
              executeQuery({
                query,
                data: [email, 1],
                callback: (err, userData) => {
                    // if (err) return res.status(500).json(err)
                    console.log(userData)
                    let token;
                    if (userData[0]) {
                      console.log("USER ID", userData[0].id);
                      console.log("USER type", userData[0].user_type);

                      switch (userData[0].user_type) {
                        case 1:
                          token = Jwt.sign(
                            { user_id: userData[0].id, user_type: userData[0].user_type },
                            process.env.ADMIN_SECRET_KEY,
                            { expiresIn: "30h" }
                          );
                          break;

                        case 2:
                          token = Jwt.sign(
                            { user_id: userData[0].id, user_type: userData[0].user_type },
                            process.env.MEMBER_SECRET_KEY,
                            { expiresIn: "30h" }
                          );
                          break;

                        case 3:
                          token = Jwt.sign(
                            { user_id: userData[0].id, user_type: userData[0].user_type },
                            process.env.VENDOR_SECRET_KEY,
                            { expiresIn: "30h" }
                          );
                          break;

                        default:
                          token = Jwt.sign(
                            { user_id: userData[0].id, user_type: userData[0].user_type },
                            process.env.ADMIN_SECRET_KEY,
                            { expiresIn: "30h" }
                          );
                      }
                      const user_id = userData[0].id;

                      if (userData[0].user_type === 2)
                      {
                          const query = "SELECT * FROM cards WHERE user_id = ?";
                          executeQuery({
                            query,
                            data: [user_id],
                            callback: (err, userCardData) => {
                              // if (err) return res.status(500).json(err)
                              console.log(userCardData)
                              if (userCardData[0]) {
                                  console.log("SANRHOSH CARD AVAILABLE")
                                  const result = {
                                  message: "login successful",
                                  token,
                                  status: 1,
                                  // data: userData
                                  data: userData[0],
                                  };
                                return res.status(200).json({ error: [], result });
                              }
                              else
                              {
                                  console.log("SANRHOSH CARD NOT AVAILABLE")
                                  const query = "SELECT * FROM card_type WHERE default_card = ?";
                                  executeQuery({
                                    query,
                                    data: [1],
                                    callback: (err, cardTypeData) => {
                                      console.log(cardTypeData)
                                      if (cardTypeData[0]) {
                                          const card_type_id = cardTypeData[0].card_type_id;
                                          const card_no = generateCardNumber();

                                          const query = "INSERT INTO cards (user_id, card_type_id, card_no) VALUES (?, ?, ?)";
                                          executeQuery({
                                              query,
                                              data: [user_id, card_type_id, card_no],
                                              callback: (err, cardData) => {
                                                // if (err) return res.status(500).json(err)
                                                if (err)
                                                    return res
                                                    .status(500)
                                                    .json({ error: [{ message: err }], result: {} });

                                                      const query = "SELECT * FROM cards WHERE user_id = ?";
                                                      executeQuery({
                                                        query,
                                                        data: [user_id],
                                                        callback: (err, allCardData) => {
                                                          console.log(allCardData)
                                                          if (allCardData[0]) 
                                                          {
                                                            console.log("SANTHOSH CARD DATA");
                                                            const query = "INSERT INTO transaction (transaction_type, transaction_cr, transaction_title,user_id,card_id,card_no ) VALUES (?, ?, ?, ?, ?, ?)";
                                                            executeQuery({
                                                                      query,
                                                                      data: [ 0, cardTypeData[0].card_type_w_point, "Welcome",user_id,allCardData[0].card_id,allCardData[0].card_no],
                                                                      callback: (err, data) => {
                                                                        // if (err) return res.status(500).json(err)
                                                                        if (err)
                                                                            return res
                                                                            .status(500)
                                                                            .json({ error: [{ message: err }], result: {} });

                                                                            const result = {
                                                                            message: "login successful",
                                                                            token,
                                                                            status: 1,
                                                                            // data: userData
                                                                            data: userData[0],
                                                                            };
                                                                          return res.status(200).json({ error: [], result });
                                                                      }
                                                            });

                                                          }
                                                          else
                                                          {
                                                              return res
                                                              .status(404)
                                                              .json({
                                                                error: [{ message: "Unknown error, Please try again..." }],
                                                                result: {},
                                                              });
                                                          }
                                                        }
                                                      });
                                              }
                                          });   
                                        }
                                        else
                                        {
                                          return res
                                          .status(404)
                                          .json({
                                            error: [{ message: "Unknown error, Please try again..." }],
                                            result: {},
                                          });
                                        }
                                    }
                                  });
                              }
                            }
                          });
                      }
                      else
                      {
                          const result = {
                            message: "login successful",
                            token,
                            status: 1,
                            // data: userData
                            data: userData[0],
                            };
                          return res.status(200).json({ error: [], result });
                      }
                      
                    }
                    else 
                    {
                      return res
                        .status(404)
                        .json({
                          error: [{ message: "Unknown user, Please verify your email..." }],
                          result: {},
                        });
                    }
                }
              });

            } 
            else 
            {
              return res
                .status(404)
                .json({
                  error: [{ message: "Invalid email or password" }],
                  result: {},
                });
            }
        },
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ error: [{ message: "Internal server error" }], result: {} });
    }
};

export const sendEmailVerification = async (req, res) => {

  console.log(process.env.EMAIL_USER);

  try {
    const { email, user_id, user_type } = req.body;
    const token = Jwt.sign(
      { user_id: user_id, user_type: user_type },
      process.env.EMAIL_SECRET_KEY,
      { expiresIn: "24h" }
    );
    const verificationLink = `http://localhost:5173/verify-email?exp=${token}`;

    await sendVerificationEmail(email, verificationLink);

    const result = {
                  message: "'Verification email sent",
                  status: 1,
                };
  return res.status(200).json({ error: [], result });

  } catch (error) {
    console.error('Email error:', error);
    // res.status(500).json({ success: false, message: 'Email sending failed' });
    return res
              .status(500)
              .json({
                error: [{ message: "Email sending failed" }],
                result: {},
              });
  }

};

export const emailVerification = async (req, res) => {

  console.log("SANTHOSH DATA : ",req.body)

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
          .status(500)
          .json({ error: [{ message: "Token missing or invalid" }], result: {} });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token, process.env.EMAIL_SECRET_KEY);
    console.log("Decoded JWT:", decoded);

    if (!decoded.user_id| !decoded.user_type) {
      return res
          .status(400)
          .json({ error: [{ message: "TYPE and ID and TOKEN are required" }], result: {} });
    }

    const query = "SELECT * FROM users WHERE id = ? AND user_type = ?";
    executeQuery({
        query,
        data: [decoded.user_id,decoded.user_type],
        callback: (err, userData) => 
        {
            if (!userData[0])
                return res
                  .status(400)
                  .json({
                    error: [{ message: "this user not exists" }],
                    result: {},
                  });
                  const query = "UPDATE users SET email_verification = 1 WHERE id = ? AND user_type = ?";
                  executeQuery({
                      query,
                      data: [decoded.user_id,decoded.user_type],
                      callback: (err, userData) => 
                      {
                        if (err)
                        return res
                        .status(500)
                        .json({ error: [{ message: err }], result: {} });

                        const result = {
                          message: "Email verified successfully",
                          status: 1,
                        };
                        return res.status(200).json({ error: [], result });
 
                      }
                  })


        }
    })

  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


function generateCardNumber() {
  // Example prefixes: 4 for Visa, 5 for MasterCard
  const prefixes = ['4', '5'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  let cardNumber = prefix;

  // Generate 15 more digits to make it 16
  for (let i = 1; i < 16; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }

  return cardNumber;
}


// export const demo = (req, res) => {
//     try {
//       console.log(req.body);
//       const user_id = req.user?.id;
//       const authHeader = req.headers['authorization'];
//       const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "
//       console.log(token)
//       const { password, email } = req.body;

//       if (!user_id)
//         return res
//           .status(404)
//           .json({ error: [{ message: "Input data missing" }], result: {} });

//       const query = "SELECT * FROM users WHERE email = ? AND password = ?";
//       executeQuery({
//         query,
//         data: [email, password],
//         callback: (err, userData) => {
//             // if (err) return res.status(500).json(err)
//             console.log(userData)

//           }});

//     } 
//     catch (error) {
//       console.log(error.message);
//       return res
//         .status(500)
//         .json({ error: [{ message: "Internal server error" }], result: {} });
//     }
// }


export const addCard = (req, res) => { 
    try {
      
      const user_id = req.user?.id;
      console.log(user_id)

      if (!user_id)
        return res
          .status(404)
          .json({ error: [{ message: "Input data missing" }], result: {} });

      const query = "SELECT * FROM cards WHERE user_id = ?";
      executeQuery({
        query,
        data: [user_id],
        callback: (err, userCardData) => {
          // if (err) return res.status(500).json(err)
          console.log(userCardData)
          if (userCardData[0]) {
              console.log("SANRHOSH CARD AVAILABLE")

          }
          else
          {
              console.log("SANRHOSH CARD NOT AVAILABLE")
              const query = "SELECT * FROM card_type WHERE default_card = ?";
              executeQuery({
                query,
                data: [1],
                callback: (err, cardTypeData) => {
                  console.log(cardTypeData)
                   if (cardTypeData[0]) {
                    const card_type_id = cardTypeData[0].card_type_id;
                     const card_no = generateCardNumber();

                      const query = "INSERT INTO cards (user_id, card_type_id, card_no) VALUES (?, ?, ?)";
                      executeQuery({
                          query,
                          data: [ user_id, card_type_id, card_no],
                          callback: (err, cardData) => {
                            // if (err) return res.status(500).json(err)
                            if (err)
                                return res
                                .status(500)
                                .json({ error: [{ message: err }], result: {} });

                                  const query = "SELECT * FROM cards WHERE user_id = ?";
                                  executeQuery({
                                    query,
                                    data: [user_id],
                                    callback: (err, allCardData) => {
                                      console.log(allCardData)
                                      if (allCardData[0]) 
                                      {
                                        console.log("SANTHOSH CARD DATA");
                                        const query = "INSERT INTO transaction (transaction_type, transaction_cr, transaction_title,user_id,card_id,card_no ) VALUES (?, ?, ?, ?, ?, ?)";
                                        executeQuery({
                                                  query,
                                                  data: [ 0, cardTypeData[0].card_type_w_point, "Welcome",user_id,allCardData[0].card_id,allCardData[0].card_no],
                                                  callback: (err, trData) => {
                                                    // if (err) return res.status(500).json(err)
                                                    if (err)
                                                        return res
                                                        .status(500)
                                                        .json({ error: [{ message: err }], result: {} });

                                                        const result = {
                                                          message: "add transaction successful",
                                                          status: 1,
                                                          // data: userData
                                                          data: userData[0],
                                                        };
                                                        return res.status(200).json({ error: [], result });
                                                  }
                                        });

                                      }
                                      else
                                      {

                                      }
                                    }
                                  });
                          }
                      });   
                    }
                    else
                    {

                    }
                }
              });
          }
        }
      });
    } 
    catch (error) {
      console.log(error.message);
      
    }
}