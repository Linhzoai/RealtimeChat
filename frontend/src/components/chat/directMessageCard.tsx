import type { Conversation } from "@/types/chat"
import ChatCard from "./chatCard"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import UserAvatar from "./userAvatar";
import StatusBadge from "./statusBadge";
import UnreadCountBadge from "./unreadCountbadge";
import { useSocketStore } from "@/stores/useSocketStore";
export default function DirectMessageCard({convo}:{convo: Conversation}){
    const {user} = useAuthStore();
    const {activeConversationId, setActiveConversation, messages,fetchMessages} = useChatStore();
    const {onlineUsers} = useSocketStore();
    if(!user) return null;
    const otherUser =  convo.participants.find((p)=> p._id!==user._id);
    if(!otherUser) return null;
    const unreadCount = convo.unreadCount[user._id];
    const lastMessage = convo.lastMessage?.content ?? "";
    const handleSeclectConversation = async (id: string)=>{
        setActiveConversation(id);
        if(!messages[id]){
            await fetchMessages();
        }
    }
    return <ChatCard 
        convoId={convo._id}
        name = {otherUser.displayName ?? ""}
        timestamp={convo.lastMessage?.createdAt?new Date(convo.lastMessage.createdAt):undefined}
        isActive ={activeConversationId===convo._id}
        onSelect={handleSeclectConversation}
        unreadCount={unreadCount}
        leftSection={<>
            {/* todo:  user avatar */}
            <UserAvatar name={otherUser.displayName??""} type="sideBar" avatarUrl={otherUser.avatarUrl?? undefined} className=""/>
            {/* todo: status badge */}
            <StatusBadge status ={onlineUsers.includes(otherUser?._id || "") ? "online":"offline"}/>
            {/* todo: unreadCount */}
            {unreadCount>0 && <UnreadCountBadge unreadCount={unreadCount}/>}
        </>}
        subtitle={
            <p className={cn("text-sm truncate",unreadCount>0?"font-medium text-foreground":"text-muted-foreground")}>{lastMessage}</p>
        }
    />
}