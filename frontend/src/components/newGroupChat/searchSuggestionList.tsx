import type { Friend } from "@/types/user";
import UserAvatar from "../chat/userAvatar";

interface SearchSuggestionListProps{
    filteredFriends: Friend[];
    onSelect: (friend: Friend)=>void;

}

export default function SearchSuggestionList({filteredFriends, onSelect}: SearchSuggestionListProps){
    if(filteredFriends.length ===0) return;

    return(
        <div className="border rounded-lg mt-2 max-h-[180px] overflow-y-auto divide-y">
           {filteredFriends.map((friend)=>{
            return(
                <div key={friend._id} 
                     className="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted transition"
                     onClick={()=>onSelect(friend)}>
                        <UserAvatar avatarUrl={friend.avatarUrl} name={friend.displayName} type="chat"/>
                        <span className="font-medium">{friend.displayName}</span>
                </div>
            )
           })}
        </div>
    )
}