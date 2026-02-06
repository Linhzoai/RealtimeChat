import { useChatStore } from "@/stores/useChatStore"
import ChatWelcomeScreen from "./chatWelcomeScreen";
import ChatWinDowSkeleton from "./chatWindowSkeleten";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./chatWindowHeader";
import ChatWindowBody from "./chatWindowBody";
import ChatWindowFooter from "./chatWindowFooter";
import { useEffect } from "react";

export default function ChatWindowLayout(){
    const {conversations, activeConversationId, messageLoading: loanding,markAsSeen} = useChatStore();
    const selectedConversation = conversations.filter((c)=> c._id===activeConversationId);
    useEffect(()=>{
        if(!selectedConversation) return;
        const markSeen = async () =>{
            try{
                await markAsSeen();
            }
            catch(err){
                console.log("Lỗi khi markSeen",err);
            }
        }
        markSeen();
    }   )
    if(!selectedConversation || selectedConversation.length===0){
        return <ChatWelcomeScreen/>
    }
    if(loanding){
        return <ChatWinDowSkeleton/>
    }
    
    return(
        <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
            {/* Header */}
            <ChatWindowHeader chat = {selectedConversation[0]}/>
            {/* Body */}
            <ChatWindowBody/>
            {/* Footer */}
            <ChatWindowFooter selectedConvo={selectedConversation[0]}/>
        </SidebarInset>
    )
}