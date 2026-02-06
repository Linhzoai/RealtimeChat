import { useAuthStore } from "@/stores/useAuthStore"
import { LogOut } from "lucide-react"
export default function Logout(){
    const {signOut} = useAuthStore();
    return(
        <div className="flex gap-2 items-center flex-1" onClick={signOut}>
           <LogOut/>    
            <p className="">Đăng xuất</p>
        </div>
    )
}