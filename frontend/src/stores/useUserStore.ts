import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export const useUserStore = create<UserState>((set,get)=>({
    updateAvatarUrl: async (formData)=>{
        try{
            const {user, setUser} = useAuthStore.getState();
            const res = await userService.uploadAvatar(formData);
            if(user){
                setUser({
                    ...user,
                    avatarUrl: res.avatarUrl
                })
                toast.success("Upload avatar thành công");
                useChatStore.getState().fetchConversation();
            }

        }
        catch(err){
            console.log("Lỗi khi upload avatar: ", err);
            toast.error("Upload avatar thất bại");
        }
    }
}));