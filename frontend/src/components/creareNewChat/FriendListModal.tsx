import { useFriendStore } from '@/stores/useFriendStore';
import { User } from 'lucide-react';
import { Card } from '../ui/card';
import UserAvatar from '../chat/userAvatar';
import { useChatStore } from '@/stores/useChatStore';
import type { Dispatch, SetStateAction } from 'react';
export default function FriendListModal({setOpen}: {setOpen: Dispatch<SetStateAction<boolean>>}) {
    const { friendList } = useFriendStore();
    const {createConversation} = useChatStore();
    if(friendList.length===0){
        return(
            <div className='text-center py-8 text-muted-foreground'>
                <User className='size-12 mx-auto mb-3 opacity-50'/>
                <p className='text-sm'>Chưa có bạn bè</p>
            </div>
        )
    }
    const handleAddConversation = (friendId:string)=>{
        createConversation("direct", "", [friendId]);
        setOpen(false);
    }
    return (
        <div className='space-y-4'>
                <h1 className= "text-sm font-semibold capitalize text-muted-foreground mb-3 tracking-wider  ">Danh sách bạn bè</h1>
                <div className='space-y-2 max-h-60 overflow-y-auto'>
                    {friendList.map((friend) => (
                        <Card 
                            key ={friend._id} 
                            className='p-3 cursor-pointer transition-smooth hover:shadow-soft glass hover:bg-muted/30 group/friendCard'
                            onClick={()=>handleAddConversation(friend._id)}
                        >
                            <div className='flex items-center gap-3 '>
                                {/* avatar */}
                                <div className='relative'>
                                    <UserAvatar name={friend.displayName} type="sideBar" avatarUrl={friend.avatarUrl} />
                                </div>
                                {/* info */}
                                <div className='flex-1 min-w-0 flex flex-col'>
                                    <h2 className='text-sm font-semibold truncate'>{friend.displayName}</h2>
                                    <span className='text-xs text-muted-foreground'>@{friend.username}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
    );
}
