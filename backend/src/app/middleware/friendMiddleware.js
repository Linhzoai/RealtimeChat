import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";
import {checkUserInConversation}  from "../../utils/messageHelper.js";
import { uploadImage } from "./uploadMiddleware.js";
const pair = (a,b) => (a.toString()<b.toString()?[a,b]:[b,a]);

const checkFriendship = async (req, res, next) => {
    try {
        const contentType = req.headers["content-type"];
        const me = req.user._id;
        const recipientId = req.body?.memberIds[0] ?? null;
        if(!recipientId ){
            return res.status(400).json({message: "Thiếu thông tin người nhận"});
        }
        const existedRecipient = await User.findById(recipientId);
        if(!existedRecipient){
            return res.status(404).json({message: 'Người nhận không tồn tại'});
        }
        const [userA, userB] = pair(me, recipientId);
        const isFriend = await Friend.findOne({userA, userB});
        if(!isFriend){
            return res.status(400).json({message: "Bạn không phải bạn bè"});
        }
        if(contentType ==="multipart/form-data"){
            uploadImage.single("image")(req, res, next);
        }
        return next();
    } catch (error) {
        console.log("Lỗi khi kiểm tra bạn bè: ", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}
const checkGroupMembership = async (req, res, next) =>{
    try{
        const {conversationId} = req.body;
        const userId = req.user._id;
        const contentType = req.headers["content-type"];
        if(contentType ==="multipart/form-data"){
                
        }
        const conversation = await Conversation.findById(conversationId);
        if(!conversation){
            return res.status(404).json({message: "Cuộc trò chuyện không tồn tại"})
        }
        const isMember = checkUserInConversation(conversation, userId);
        if(!isMember){
            return res.status(403).json({message: "Bạn không phải viên nhóm"});
        }
        req.conversation = conversation;

        next();
    }
    catch(err){
        console.log("Lỗi khi kiểm tra thành viên nhóm: ", err);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}
export {checkFriendship, checkGroupMembership} ;