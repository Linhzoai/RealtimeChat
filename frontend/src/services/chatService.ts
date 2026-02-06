import api from  '@/lib/axios';
import  type {ConversationResponse,Message} from "@/types/chat";

interface fetchMessagesProps{
    messages: Message[],
    cursor?: string,
}
const limitPage = 20;
export const chatService = {
    async fetchConversation(): Promise<ConversationResponse>{
        const res = await api.get("/conversation");
        return res.data;
    },

    async fetchMessages (id: string, cursor?: string): Promise<fetchMessagesProps>{
        const res = await api.get(`/conversation/${id}/messages?limit=${limitPage}&cursor=${cursor}`);
        return {
            messages: res.data.messages,
            cursor: res.data.nextCursor,
        }
    },
    async sendDirectMessage(recipientId: string, content:string, file?:File, conversationId?:string,imgUrl?:string){
        const contentType =file ? "multipart/form-data" : "application/json";
        const res = await api.post("/message/direct",{memberIds: [recipientId], content,  conversationId,imgUrl}, {headers: {"Content-Type": contentType}})
        return res.data.message;
    },
    async sendGroupMessage( conversationId:string,content:string,file?:File, imgUrl?:string){
        const contentType =file ? "multipart/form-data" : "application/json";
        const res = await api.post("/message/group", { conversationId, content, imgUrl}, {headers: {"Content-Type": contentType}});
        return res.data.message;
    },
    async markAsSeen(conversationId: string){
        const res = await api.patch(`/conversation/${conversationId}/seen`);
        return res.data;
    },
    async sendImage(conversationId:string, file: File){
        const formData = new FormData();
        formData.append("image", file);
        const res = await api.post(`message/${conversationId}/image`);
        return res.data;
    },
    async createConversation(type: "direct"|"group", name:string, memberIds: string[]){
        const res = await api.post("/conversation", {type, name, memberIds});
        return res.data.conversation;
    },
}