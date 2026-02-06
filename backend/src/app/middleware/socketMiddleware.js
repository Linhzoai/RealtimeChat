import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next)=>{
    try{
        const token  = socket.handshake.auth?.token;
        if(!token) return next(new Error("Unauthorized - Token không tồn tại"));

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decoded) return next(new Error("Unauthorized - Token không tồn tại hoặc không hợp lệ"));
        const user = await User.findById(decoded.userId).select("-hashPassword");
        if(!user) return next(new Error("User khong tồn tại"));
        socket.user = user;

        next();
    }
    catch(err){
        console.log("Lỗi khi xác thực socket: ", err);
        next(new Error("Unauthorized"));
    }
}