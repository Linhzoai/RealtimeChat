import type { Participant } from "@/types/chat";
import UserAvatar from "./userAvatar";
import { Ellipsis } from "lucide-react";

export default function GroupChatAvatar({participants, type}: {participants: Participant[], type: "chat"|"sideBar"}){
    const avatar = [];
    const limit = Math.min(participants.length,2);
    for(let i=0;i<limit;i++){
        const member = participants[i];
        avatar.push(<UserAvatar type={type} name={member.displayName} key={i} avatarUrl={member.avatarUrl?? undefined} className=""/>)
    }
    return(
        <div  className="relative flex -space-x-3 *:data-[slot=avatar]:ring-background data-[slot=avatar]:ring-2">
           {avatar}
           { participants.length>limit &&
            <div className="flex items-center z-10 justify-center size-8 rounded-full bg-muted ring-2 ring-background text-muted-foreground">
                <Ellipsis className="size-4"/>
            </div>
           }
        </div>
    )
}