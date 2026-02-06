import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationAfterCreateMessage,checkUserInConversation, emitNewMessage } from "../../utils/messageHelper.js";
import {io} from "../../socket/index.js"
class messageController {
    sendDirectMessage = async (req, res) => {
        try {
            const {recipientId, content, conversationId} = req.body;
            const contentType = req.headers["content-type"];
            const senderId = req.user?._id;
            if(!senderId){
                return res.status(401).json({message: 'Bạn chưa đăng nhập'});
            }
            let conversation = null;
            if(conversationId){
                conversation = await Conversation.findById(conversationId);
                const ifParticipant = checkUserInConversation(conversation, senderId);
                if(!ifParticipant){
                    return res.status(403).json({message: 'Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này'});
                }
            }
            if(!conversation){
                conversation = await Conversation.create({
                    type: 'direct',
                    participants:[
                        {userId: senderId, joinAt: new Date()},
                        {userId: recipientId, joinAt: new Date()}
                    ],
                    lastMessageAt: new Date(),
                    unreadCount: new Map()
                });
            }
            let imgUrl = null;
            if(contentType === "multipart/form-data"){
                imgUrl = req.file.path;
            }

            const message = await Message.create({
                conversationId: conversation._id,
                senderId,
                content,
                imgUrl,
            })
            updateConversationAfterCreateMessage(conversation, message, senderId);
            emitNewMessage(io, conversation, message);
            await conversation.save();
            return res.status(200).json({ status: 'Gửi tin nhắn thành công', message });
        } catch (error) {
            console.log("Lỗi khi gửi tin nhắn: ", error);
            res.status(500).json("Lỗi hệ thống");
        }
    }
    sendGroupMessages = async (req, res) => {
        try {
            const {conversationId, content} = req.body;
            const senderId = req.user?._id;
            const conversation = req.conversation;
            const contentType = req.headers["content-type"];
            if(!content){
                return  res.status(400).json({message: 'Thiếu nội dụng tin nhắn'});
            }
            const message = await Message.create({
                conversationId,
                senderId,
                content,
            })
            updateConversationAfterCreateMessage(conversation, message, senderId);
            emitNewMessage(io, conversation, message);
            await conversation.save();
            return res.status(200).json({status: "Gửi tin nhắn thành công", message}, );
        } catch (error) {
            console.log("Lỗi khi gửi tin nhắn: ", error);
            res.status(500).json("Lỗi hệ thống");
        }
    }
    sendImageMessage = async (req, res) =>{
        
    }
}
export default new messageController();