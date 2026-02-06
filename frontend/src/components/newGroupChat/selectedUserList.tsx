import type { Friend } from "@/types/user"
import UserAvatar from "../chat/userAvatar";
import { X } from "lucide-react";

interface SelectedUserListProps{
    selectedUsers: Friend[];
    onRemove: (friend: Friend)=>void;
}

export default function SelectedUserList({selectedUsers, onRemove}: SelectedUserListProps){
    if(selectedUsers.length ===0) return;

    return(
        <div className="flex flex-wrap gap-2 pt-2">
            {selectedUsers.map((user)=>(
                <div key={user._id}
                     className="flex items-center gap-1 bg-muted rounded-full text-sm px-3 py-1 cursor-pointer hover:bg-muted/80 transition group/card">
                        <UserAvatar type="chat" name={user.displayName} avatarUrl={user.avatarUrl}/>
                        <span>{user.displayName}</span>
                        <X className="hidden size-3 cursor-pointer hover:text-destructive group-hover/card:block" onClick={()=>onRemove(user)}></X>
                </div>
            ))}           
        </div>
    )
}