import { useChatStore } from "@/stores/useChatStore"
import GroupChatCard from "./groupChatCard";

export default function GroupChatList(){
    const {conversations} = useChatStore();
    if(!conversations){
        return;
    }
    const groupConversations = conversations.filter((c)=> c.type==='group');
    return(
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
           {
            groupConversations.map((c)=>(
                <GroupChatCard key={c._id} convo={c}/>
            ))
           }
        </div>
    )
}