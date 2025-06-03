import Jwt from "jsonwebtoken"


const verifyToken = (req, res, next) => {
    try {

        const token = req.header("authorization")
        if (!token)
            return res.status(403).json({ error: [{ message: "token is required for authentication" }], result: {} })
        
        const decode = Jwt.verify(
          token.split(" ")[1],
          process.env.ADMIN_SECRET_KEY
        );

        req.user = {
          id: decode.user_id,
          user_type: decode.user_type,
        };
        console.log("requser", req.user)
        next()
        
    } catch (error) {

        if (error.message === "jwt expired")
        {
            return res.status(401).json({error:[{message:"Token expired"}], result: {}})
        }

        return res
          .status(401)
          .json({ error: [{ message: "Invalid token" }], result: {} });
    }
} 

export default verifyToken;