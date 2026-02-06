import { trusted } from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import {io} from "../../socket/index.js"
class ConversationController {
    createConversation = async (req, res)=>{
        try{
            const {type, memberIds, name} = req.body;
            const userId  = req.user._id;
            let isNewConversation = false;
            if(!type || !memberIds || (type==='group' && !name)){
                return res.status(400).json({message: "Thiếu thông tin tạo cuôc trò chuyện"});
            }
            let conversation = null;
            if(type == "direct"){
                const participants = memberIds[0];
                conversation = await Conversation.findOne({
                    type: 'direct',
                    "participants.userId": { $all: [userId, participants] }
                })
                if(!conversation){
                    conversation = new Conversation({
                        type: 'direct',
                        participants: [{userId},{userId: participants}],
                        lastMessageAt: new Date(),
                        unreadCount: new Map()
                    })
                    conversation = await conversation.save();
                    isNewConversation = true;
                }
            }
            if(type === 'group'){
                const participants = [{userId},...memberIds.map((id)=> ({userId: id}))];
                conversation = new Conversation({
                    type: 'group',
                    group: {
                        name,
                        createBy: userId,
                    },
                    participants,
                    lastMessageAt: new Date(),
                    unreadCount: new Map(),   
                })
                await conversation.save();
                isNewConversation = true;
            }
            if(!conversation){
                return res.status(500).json({message: "type không hợp lệ"});
            }
            await conversation.populate([
                {path: 'participants.userId', select: "username displayName avatarUrl"},
                {path: 'seenBy', select: "displayName username avatarUrl"},
                {path: 'lastMessage.senderId', select: "username displayName avatarurl"},
            ]);
            const participants = conversation.participants.map((p)=>({
                _id: p.userId._id,
                displayName: p.userId.displayName,
                avatarUrl: p.userId.avatarUrl,
                joinAt:p.joinAt,
            }));
            const formatConversation = {
                ...conversation.toObject(),
                participants,
                unreadCount: conversation.unreadCount || {},
            }
            if(isNewConversation){
                memberIds.forEach((id)=>{
                    io.to(id.toString()).emit("new-chat",formatConversation);
                })  
            }
            return res.status(201).json({message: "Tạo cuộc trò chuyện thành công", conversation: formatConversation})
        }
        catch(error){
            console.log("Lỗi khi gửi tin nhắn nhóm: ", error);
            res.status(500).json("Lỗi hệ thống");
        }
    }
    getConversation = async (req, res) =>{
        try{
            const userId = req.user._id;
            const conversations = await Conversation.find({
                "participants.userId": userId,
            }).sort({lastMessageAt: -1, updatedAt: -1})
            .populate('participants.userId', ' displayName avatarUrl')
            .populate('lastMessage.senderId', ' displayName avatarUrl')
            .populate('seenBy', ' displayName avatarUrl');
            const formatted = conversations.map((conv)=>{
                const participants = conv.participants.map((p)=>({
                    _id: p.userId._id,
                    displayName: p.userId.displayName,
                    avatarUrl: p.userId.avatarUrl,
                    joinAt:p.joinAt,
                }));
                return {
                    ...conv.toObject(),
                    participants,
                    unreadCount: conv.unreadCount || {},    
                }
            })
            return res.status(200).json({conversations: formatted});

        }
        catch(err){
            console.log("Lỗi khi lấy cuộc trò chuyện: ", err);
            res.status(500).json("Lỗi hệ thống");
        }
    }
    getMessages = async(req, res)=>{
        try{
            const {conversationId} = req.params;
            const {cursor, limit = 20}  = req.query;
            let query = {conversationId};
            if(cursor){
                query.createdAt = {$lt: new Date(cursor)}
            }
            let messages = await Message.find(query).sort({createdAt: -1}).limit(Number(limit) +1).lean();
            let nextCursor = null;

            if(messages.length > limit){
                nextCursor = messages[limit].createdAt.toISOString();
                messages.pop();
            }
            messages.reverse();
            return res.status(200).json({messages,nextCursor});
        }
        catch(err){
            console.log("Lỗi khi lấy tin nhắn: ", err);
            res.status(500).json("Lỗi hệ thống");
        }
    }
    getUserConversationForSocketIO = async(userId)=>{
        try{
            const conversations = await Conversation.find(
                {"participants.userId": userId},
                {_id: 1}
            );
            return conversations.map((c)=> c._id.toString());

        }
        catch(err){
            console.log("Lỗi khi fetch conversation socket io", err);
            return [];
        }
    }

    markAsSeen = async (req, res)=>{
        try{
                const {conversationId} = req.params;
                const userId = req.user._id;
                const conversation = await Conversation.findById(conversationId).populate('participants.userId', ' displayName avatarUrl');
                if(!conversation) return res.status(404).json({message: "Cuộc hội thoại không tồn tại"});
                const lastMessage = conversation.lastMessage;
                if(!lastMessage) return res.status(200).json({message: "không có tin nhắn đẻ mark as seen", conversation});
                if(lastMessage.senderId.toString() === userId.toString()) return res.status(200).json({message: "Sender không cần mark as seen"});
                const update = await Conversation.findByIdAndUpdate(
                    conversationId,
                    {
                        $addToSet: {seenBy: userId},
                        $set: {[`unreadCount.${userId}`] : 0},
                    },{new: true}   
                )
                const participants = conversation.participants.map((p)=>({
                    _id: p.userId._id,
                    displayName: p.userId.displayName,
                    avatarUrl: p.userId.avatarUrl,
                    joinAt:p.joinAt,
                }))
                const formatConversation = {
                    ...conversation.toObject(),
                    participants,
                    unreadCount: conversation.unreadCount || {}
                }
                io.to(conversationId).emit("read-message",{
                    formatConversation,
                    lastMessage: {
                        _id: update.lastMessage?._id,
                        content: update.lastMessage?.content,
                        createdAt: update.lastMessage.createdAt,
                        senderId: update.lastMessage.senderId,
                    }
                })
                res.status(200).json({
                    message: "Marked as seen",
                    seenBy: update?.seenBy || [],
                    myUnreadCount: update?.unreadCount[userId] || 0,
                })
        }
        catch(err){
            console.error("Lỗi khi markAsSeen: ", err);
            return res.status(500).json({message: "Lỗi hệ thống"});
        }
    }
}

export default new ConversationController();