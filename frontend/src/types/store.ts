
import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    callback: number;
    signUp: (username: string, password: string, email: string, firstName: string, lastName: string, phoneNumber: string) => Promise<void>;
    signIn: (username: string, password: string) => Promise<void>;
    clearState: () => void;
    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>;
    setUser: (user: User) => void;
    refresh: () => Promise<void>;
    hydrateFromStorage: ()=>void
}

export interface ThemeState{
    isDark: boolean;
    toggleTheme: ()=> void;
    setTheme: (dark: boolean) => void;
}
export interface ChatState{
    conversations: Conversation[];
    messages: Record<string,{
        items: Message[],
        hasMore: boolean,
        nextCursor: string | undefined
    }>;
    activeConversationId: string | null;
    convoLoading: boolean;
    messageLoading: boolean;
    loading: boolean;
    reset:()=>void;
    setActiveConversation: (id:string|null) =>void;
    fetchConversation: ()=> Promise<void>;
    fetchMessages: (conversationId?:string)=>Promise<void>
    sendDirectMessage: (recipientId:string, content:string,file?:File, imgUrl?:string)=>Promise<void>
    sendGroupMessage: (conversationId:string, content:string,file?:File, imgUrl?:string)=>Promise<void>
    addMessage:(message: Message)=>Promise<void>;
    updateConversation: (conversation: Conversation) => void;
    markAsSeen: ()=> Promise<void>;
    addConvo:(convo: Conversation) => void;
    createConversation: (type: "direct"|"group", name:string, memberIds: string[])=>Promise<void>;
}

export interface SocketState{
    socket: Socket | null;
    onlineUsers: string[];
    connectSocket: () => void;
    disconnectSocket: () => void;
}

export interface UserState{
    updateAvatarUrl: (formData: FormData) =>Promise<void>;
}