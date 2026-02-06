import { useFriendStore } from "@/stores/useFriendStore"
import FriendRequestItem from "./friendRequestItem";

export default function SendRequest(){
    const {sendList} = useFriendStore();
    if(!sendList || sendList.length===0){
        return <p className="text-sm text-muted-foreground">
            Bạn chưa gửi lời mời kết bạn nào
        </p>
    }
    return(
        <div className="space-y-3 mt-4">
            {sendList.map((request)=>(<FriendRequestItem 
                key = {request._id}
                requestInfo={request} 
                type="send" 
                action={<p className="text-sm text-muted-foreground">Đang chờ trả lời....</p>}/>))}
        
        </div>
    )
}