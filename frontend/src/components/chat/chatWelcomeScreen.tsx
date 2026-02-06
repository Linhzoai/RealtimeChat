import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./chatWindowHeader";

export default function ChatWelcomeScreen(){
    return(
        <SidebarInset className="flex w-full h-full bg-transparent"> 
            <ChatWindowHeader/>
            <div className="flex bg-primary-foreground rounded-2xl flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="size-24 mx-auto mb-6 bg-gradient-chat rounded-full flex flex-col items-center justify-center shadow-glow pulse-ring">
                        <span className="text-3xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-chat bg-clip-text text-transparent">Chào mừng bạn đến với úng dụng chat realtime</h2>
                    <p className="text-muted-foreground">Chọn 1 cuộc hội thoại để bắt đầu chat</p>
                </div>
            </div>
        </SidebarInset>
    )
}