import {useState, useEffect, type Dispatch, type SetStateAction} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsTrigger, TabsList} from "@/components/ui/tabs";
import { useFriendStore } from "@/stores/useFriendStore";
import ReceivedRequest from "./receivedRequest";
import SendRequest from "./sendRequest";
import { DialogDescription } from "@radix-ui/react-dialog";

interface FriendRequestDialogProps{
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FriendRequestDialog({open, setOpen}: FriendRequestDialogProps){
    const [tab, setTab] = useState("received");
    const {getAllFriendRequests} = useFriendStore();
    useEffect(()=>{
       const loadRequest = async()=>{
        try{
            getAllFriendRequests();
        }
        catch(err){
            console.log("Lỗi khi tải yêu cầu kết bạn: ", err);
        }};
       loadRequest();
    },[])
    return(
        <Dialog open={open} onOpenChange={setOpen}>
           <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>
                    Lời mời kết bạn
                </DialogTitle>
                <DialogDescription>
                    Thao tác này không thể hoàn tác
                </DialogDescription>
            </DialogHeader>
            <Tabs value = {tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="received">Đã nhận</TabsTrigger>
                    <TabsTrigger value="send">Đã gửi</TabsTrigger>
                </TabsList>
                <TabsContent value = "received" >
                    <ReceivedRequest/>
                </TabsContent>
                <TabsContent value = "send">
                    <SendRequest/>
                </TabsContent>
            </Tabs>
           </DialogContent>
        </Dialog>
    )
}