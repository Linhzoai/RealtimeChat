import type { IFormValues } from "../chat/addFriendModal"
import type { UseFormRegister } from "react-hook-form"
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, UserPlus } from "lucide-react";

interface SendRequestPropss{
    register: UseFormRegister<IFormValues>;
    loading: boolean;
    searchedUsername: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) =>  void;
    onBack: () => void;
}
export default function SendFriendRequest({register, loading, searchedUsername, onSubmit, onBack}: SendRequestPropss){
    return(
        <>
           <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-4">
                <span className="success-message">Tìm thây <span className="font-semibold">{searchedUsername}</span> rồi nè</span>
                <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">Giới thiệu</Label>
                    <Textarea id="message" rows={3} className="glass border-border/50 focus:border-primary/50 transition-smooth" {...register("message")}/>

                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onBack} className="flex-1 glass hover:text-destructive">Quay lại</Button>
                    <Button type="submit" disabled={loading} className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth">
                        {loading ? <span className="flex items-center gap-1">Đang gửi <Loader2 className="size-4 ml-1 mt-1"/></span> : <div className="flex items-center gap-1"><span>Gửi lời mời</span><UserPlus className="size-4 ml-1 mt-1"/></div>}
                    </Button>
                </DialogFooter>
            </div>
        </form>
        </>
    )
}