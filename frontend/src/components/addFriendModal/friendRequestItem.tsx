import type { FriendRequest } from "@/types/user";
import type { ReactNode } from "react";
import UserAvatar from "../chat/userAvatar";

interface RequestItemProps{
    requestInfo: FriendRequest;
    action: ReactNode;
    type: "send" | "received";
}

export default function FriendRequestItem({requestInfo, action, type}: RequestItemProps){
    if(!requestInfo) return;
    const info = type==="send"? requestInfo.to: requestInfo.from;
    if(!info) return;
    
    return(
        <div className="flex items-center justify-between rounded-lg shadow-md border border-primary-foreground p-3">
            <div className="flex items-center gap-3">
                <UserAvatar type="sideBar" name={info.displayName} avatarUrl={info.avatarUrl}/>
                <div className="flex flex-col">
                    <span className="font-medium">{info.displayName}</span>
                    <span className="text-sm text-muted-foreground">@{info.username}</span>
                </div>
            </div>
           {action}
        </div>
    )
}