import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute(){
    const {accessToken, user, loading, refresh, fetchMe, } = useAuthStore();
    const [starting, setStarting] = useState(true);
    const init = async () =>{
        if(!accessToken){
            await refresh();
        }
        if(accessToken && !user){
            await fetchMe();
        }
        setStarting(false);
    }
    useEffect(() => {
        init();
    }, []);

    if(starting || loading){
        return <div className="flex justify-center items-center h-screen">Đang tải trang .....</div>
    }

    if(!accessToken){
        return <Navigate to="/sign-in" replace />
    }
    return(
        <Outlet>
           
        </Outlet>
    )
}