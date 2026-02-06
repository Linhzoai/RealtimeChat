import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message } from "@/types/chat"
import UserAvatar from "./userAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface MessageItemProps{
    message: Message,
    index: number,
    messages: Message[],
    selectedConvo: Conversation,
    lastMessageStatus: "delivered"| "seen"
}

export default function MessageItem({message, index, messages, selectedConvo, lastMessageStatus}:MessageItemProps){
    const prev = messages[index + 1] ?? undefined;
    const next = messages[index - 1] ?? undefined;
    const isGroupBreak = 
            index ===0 || 
            message.senderId !== prev?.senderId || 
            new Date(message.createdAt).getTime() - new Date(prev?.createdAt ?? Date.now()).getTime() > 30000;
    const paticipant = selectedConvo.participants.find((p)=>p._id?.toString() === message.senderId?.toString());
    const isShowTime = new Date(message.createdAt).getTime() - new Date(next?.createdAt ?? Date.now()).getTime() < -30000;
    return(
        <div className={cn("flex items-center gap-2 message-bounce mb-1", message.isOwn?"self-end": "self-start")}>
            {/* Avatar */}

            {/* Message */}
            <div className={cn("max-w-xs lg:max-w-md space-y-1 flex flex-col", message.isOwn ? "items-end": "items-start")}>
                <div className="flex items-center gap-2">
                    {!message.isOwn && (
                        <div className="w-8">
                            {isGroupBreak && <UserAvatar type="chat" name ={paticipant?.displayName ?? "No name"} avatarUrl={paticipant?.avatarUrl ?? undefined}/>} 
                        </div>
                    )}
                    <Card className={cn("p-3    ", message.isOwn? "bg-chat-bubble-received border-0": "bg-chat-bubble-received ")}>
                        <p className="leading-relaxed text-sm wrap-break-words">{message.content}</p>
                    </Card>
                </div>
                
                {isShowTime && <span className="text-xs text-muted-foreground ml-10"> {formatMessageTime(new Date(message.createdAt))} </span>}

                {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
                    <Badge variant="outline" className={cn("text-xs px-1.5 py-0.5 h-4 border-0", lastMessageStatus==="seen"? "bg-primary/20 text-primary": "bg-muted text-muted-foreground")}>
                        {lastMessageStatus==="delivered" ? "Đã gửi" : "Đã xem"}
                    </Badge>
                )}
            </div>
        </div>
    )
}