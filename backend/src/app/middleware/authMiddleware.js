import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware =  (req, res , next) => {
    try{
        //lấy token từ header
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        //xác thực token
        if(!token){
            return res.status(401).json({message: "Không tìm thấy token"});
        }
        //xác thực user
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if(err){
                console.log("Lỗi khi xác thực jwt: ",err);
                return res.status(403).json({message: "Access token hết hạn hoặc không đúng"});
            }
            //gắn user vào request
            const user = await User.findById(decodedUser.userId).select("-hashPassword");
            if(!user){
                return res.status(401).json({message: "User không tồn tại"});
            }
            req.user = user;
            next();
        })
    }
    catch(error){
        console.log("Lỗi khi gọi authMiddleware: ",error);
        return res.status(500).json({message: "Lỗi xác thực jwt"});
    }
}

export default authMiddleware;
