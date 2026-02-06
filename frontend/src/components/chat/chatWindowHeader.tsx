import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "@radix-ui/react-separator";
import GroupChatAvatar from "./groupChatAvatar";
import UserAvatar from "./userAvatar";
import StatusBadge from "./statusBadge";
import { useSocketStore } from "@/stores/useSocketStore";


export default function ChatWindowHeader({ chat }: { chat?: Conversation }) {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  const {onlineUsers} = useSocketStore();
  let otherUser;
  chat = chat ?? conversations.find((c) => c._id === activeConversationId);
  if (!chat) {
    return (
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
      </header>
    );
  }
  if (chat.type === "direct") {
    const otherUsers = chat.participants.filter((p) => p._id !== user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;
    if (!otherUser || !user) {
      return ;
    }
  }
  return (
    <header className="sticky top-0 z-10 px-4 py-2 flex items-center bg-background">
      <div className="flex items-center gap-1 w-full">
        <SidebarTrigger className=" -ml-1 text-foreground"/>
        <Separator orientation="vertical" className="mr-2 bg-muted-foreground data-[orientation=vertical]:h-4 data-[orientation=vertical]:w-px"/>
        <div className="flex items-center w-full gap-3 p-2">
            {/* avatar */}
            <div className="relative">
            {
               chat.type ==='direct'?
               (
                <>
                    <UserAvatar type="chat" name={otherUser?.displayName ??"No Name"} avatarUrl={otherUser?.avatarUrl || undefined} />
                    <StatusBadge status={onlineUsers?.includes(otherUser?._id|| "")?"online":"offline"}/>
                </>
               ) :(
                    <GroupChatAvatar type='chat' participants={chat.participants} />
               )
            }
            
            </div>
            <h2 className="font-semibold text-foreground">{chat.type==='direct'? otherUser?.displayName : chat.group.name}</h2>
        </div>
      </div>
    </header>
  );
}
