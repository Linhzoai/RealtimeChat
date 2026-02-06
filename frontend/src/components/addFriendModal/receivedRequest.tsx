import { useFriendStore } from "@/stores/useFriendStore";
import { Button } from "../ui/button";
import FriendRequestItem from "./friendRequestItem";
import { toast } from "sonner";

export default function ReceivedRequest(){
    const {receivedList, loading,acceptFriendRequest, declineFriendRequest} = useFriendStore();
    if(!receivedList || receivedList.length===0){
        return <p className="text-sm text-muted-foreground">
            Bạn chưa nhận lời mời kết bạn nào
        </p>
    }
    const handleAcceptRequest = async (requestId: string) => {
        try{
            await acceptFriendRequest(requestId);
            toast.success("Đã chấp nhận lời mời kết bạn");
        }catch(error){
            console.log(error);
        }
    }
    const handleDeclineRequest = async (requestId: string) => {
        try{
            await declineFriendRequest(requestId);
            toast.success("Đã từ chối lời mời kết bạn");
        }catch(error){
            console.log(error);
        }
    }
    return(
        <div className="space-y-3 mt-4">
           {receivedList.map((request)=>(<FriendRequestItem 
                key = {request._id}
                requestInfo={request} 
                type="received" 
                action={<div className="flex items-center gap-2">
                    <Button disabled={loading} variant="outline" onClick={()=>handleDeclineRequest(request._id)} className="glass hover:text-destructive">Từ chối</Button>
                    <Button disabled={loading} variant="primary" onClick={()=>handleAcceptRequest(request._id)} className="glass hover:text-green-500">Chấp nhận</Button>
                </div>}/>))}
        </div>
    )
}