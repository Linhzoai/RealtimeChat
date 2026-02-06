import api from "@/lib/axios";
import {useAuthStore} from "../stores/useAuthStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";
export default function MainPage(){
    const {signOut} = useAuthStore();
    const navigate = useNavigate();
    const handleSignOut = async () => {
        try{
            await signOut();
            navigate("/sign-in");
        }
        catch(error){
            console.log(error);
        }
    }
    const handleTest = async () => {
        try{
            await api.get('/users/test');
            const number = useAuthStore.getState().callback;
            console.log(number);
            useAuthStore.setState({callback: number + 1});
            toast.success("oke");
        }
        catch(err){
            console.log(err);
            toast.error("false");
        };
    }
    return(
        <div>
           <h1>Trang chủ</h1>
           <h2>Chúc mừng bạn đã đăng nhập thành công</h2>
           <button className="text-white bg-black" onClick={handleSignOut}>Đăng xuất</button>
           <button className="text-white bg-black" onClick={handleTest}>Test</button>
        </div>
    )
}