export const updateConversationAfterCreateMessage = (conversation, message, senderId) =>{
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            createdAt: message.createdAt,
            senderId,
        }
    });
    conversation.participants.forEach((p)=>{
        const memberId = p.userId.toString();
        const isSender = memberId === senderId.toString();
        const preCount = conversation.unreadCount.get(memberId) || 0;
        conversation.unreadCount.set(memberId, isSender? 0: preCount +1);
    });
}
export const checkUserInConversation = (conversation, userId) => {
    return conversation.participants.some((p)=>p.userId.equals(userId));
}

export const emitNewMessage = (io, conversation, message)=>{
    io.to(conversation._id.toString()).emit("new-message", {
        message,
        conversation: {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt
        },
        unreadCount: conversation.unreadCount,
    });
}  