import type { User } from "@/types/user";
import { Card, CardContent } from "../ui/card";
import UserAvatar from "../chat/userAvatar";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useSocketStore } from "@/stores/useSocketStore";
import AvatarUploader from "./avatarUploader";

interface ProfileCardProps {
    user: User | null;
}

export default function ProfileCard({user}: ProfileCardProps){
    if(!user) return;
    if(!user.bio) user.bio = "Người dùng chưa cập nhật bio";
    const {onlineUsers} = useSocketStore();
    const isOnline = onlineUsers.includes(user._id.toString()) ? "online" : "offline";
    return(
        <Card className="sm:overflow-hidden p-0 h-52 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <CardContent className="mt-20 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                <div className="relative">
                    <UserAvatar name={user.displayName} avatarUrl={user.avatarUrl} type="profile" className="ring-4 ring-white shadow-lg"/> 
                    {/* todo avatar upload */}
                    <AvatarUploader/>
                </div>
                {/* userInfo */}
                <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-white">{user.displayName}</h1>
                    {user.bio && <p className="text-white/70 text-sm mt-2 max-w-lg line-camp-2">{user.bio}</p>}
                </div>
                {/* status */}
                <Badge className={cn("flex items-center capitalize ", isOnline==="online"?"bg-green-100 text-green-700":"bg-slate-100 text-slate-700" )}>
                    <div className={cn("size-2 rounded-full animate-pulse", isOnline==="online"?"bg-green-500":"bg-slate-500")}/>
                    {isOnline}
                </Badge>
            </CardContent>
        </Card>
    )
}