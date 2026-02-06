import {create} from 'zustand';
import {io, type Socket} from 'socket.io-client';
import { useAuthStore} from './useAuthStore';
import type { SocketState } from '@/types/store';
import { useChatStore } from './useChatStore';

const baseURL = import.meta.env.VITE_SOCKET_URL;
export const useSocketStore = create<SocketState>((set,get)=>({
    socket: null,
    onlineUsers: [],
    connectSocket: ()=>{
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;
        if(existingSocket) return; //tránh tạo nhiều socket
        const socket: Socket = io(baseURL, {
            auth: {token: accessToken},
            transports: ["websocket"]
        });
        set({socket});
        socket.on("connect",()=>{
            console.log("Đã kết nối với socket");
        });
        socket.on("online-users", (usersId)=>(set({onlineUsers: usersId})));
        //new Message
        socket.on("new-message", ({message, conversation, unreadCount})=>{
            useChatStore.getState().addMessage(message);
            const lastMessage = {
                _id: conversation.lastMessage._id,
                content: conversation.lastMessage.content,
                createAt: conversation.lastMessage.createAt,
                senderId: conversation.lastMessage.senderId
            }
            const updateConversation = {
                ...conversation,
                lastMessage: lastMessage,
                unreadCount
            }
            if(useChatStore.getState().activeConversationId === message.conversationId.toString()){
                useChatStore.getState().markAsSeen();
            }
            useChatStore.getState().updateConversation(updateConversation);
        })
        socket.on("new-chat", (formatConversation)=>{
            console.log(formatConversation);
            useChatStore.getState().addConvo(formatConversation);
            socket.emit("join-conversation", formatConversation._id);
        })
        //Read Message
        socket.on("read-message", ({formatConversation, lastMessage})=>{            
            const updated ={
                ...formatConversation,
                lastMessage,
            }
            useChatStore.getState().updateConversation(updated);
        })
    },
    disconnectSocket: ()=>{
        const socket = get().socket;
        if(socket){
            socket.disconnect();
            set({socket: null});
        }
    },
}))