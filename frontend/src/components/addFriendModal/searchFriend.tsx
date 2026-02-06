import type {  FieldErrors, UseFormRegister } from "react-hook-form"
import type { IFormValues } from "../chat/addFriendModal"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Search } from "lucide-react";

interface SearchFriendProps{
    register: UseFormRegister<IFormValues>;
    errors: FieldErrors<IFormValues>;
    loading: boolean;
    usernameValue: string;
    isFound: boolean | null;
    searchedUsername: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    onCance?: () => void;
}
export default function SearchFriend({register, errors, loading, usernameValue, isFound, searchedUsername, onSubmit, onCance}: SearchFriendProps){
    return(
        <form onSubmit={onSubmit} className = "space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold">Tìm kiếm bằng username</Label>
                <Input id="username" type="text" placeholder="Nhập username" className="glass border-border/50 focus:border-primaty/50 transition-smooth" {...register("username", {required: "Vui lòng nhập username"})}></Input>
                {errors.username && <p className="error-message">{errors.username.message}</p>}
                {isFound === false && <span className="error-message">Không tìm thấy người dùng với username <span className="font-semibold"> {searchedUsername}</span></span>}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="flex-1 glass hover:text-destructive" onClick={onCance}>Hủy</Button>
                </DialogClose>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground/90 transition-smooth" disabled={loading|| !usernameValue?.trim()} >
                    {
                        loading ?<span className="flex items-center gap-2">Đang tìm...  <Loader2 className="animate-spin"/></span>: <div className="flex items-center gap-1"><span>Tìm kiếm</span><Search className="size-4 ml-1 mt-1   "/></div>
                    }
                </Button>
            </DialogFooter>
        </form>
    )
}