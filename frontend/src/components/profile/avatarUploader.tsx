import { useUserStore } from "@/stores/useUserStore";
import { useRef } from "react"
import { Button } from "../ui/button";
import { Camera } from "lucide-react";

export default function (){
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {updateAvatarUrl} = useUserStore();
    const handleClick = () =>{
        fileInputRef.current?.click();
    }
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(!file) return;
        const formData = new FormData();
        formData.append("avatar", file);
        await updateAvatarUrl(formData);
    }
    return(
        <>
           <Button size="icon" variant="secondary" onClick={handleClick} className="absolute -bottom-1.5 right-1 size-7 rounded-full shadow-md hover:scale-115 transition duration-300 hover:bg-backgroung">
            <input type="file" hidden ref={fileInputRef} onChange={handleUpload}/>
            <Camera className="size-4 dark:text-white text-black"/>
           </Button>
        </>
    )
}