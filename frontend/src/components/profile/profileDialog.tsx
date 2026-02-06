import type { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ProfileCard from "./profileCard";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ProfileDialog({open, setOpen}: ProfileDialogProps){
    const {user} = useAuthStore();
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent aria-describedby="" className="overflow-y-auto p-0 bg-transparent border-0 shadow-2xl gap-0">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground bg-gradient-glass flex justify-center items-center pt-2">
                      Thông tin cá nhân & Cài đặt
                    </DialogTitle>
                    
                </DialogHeader>
                <div className="bg-gradient-glass">
                    <div className="max-w-4xl mx-auto p-4">
                        <ProfileCard user={user}/>
                    </div>
                </div>
            </DialogContent>       
        </Dialog>
    )
}