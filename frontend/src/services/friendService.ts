import api from "@/lib/axios";

export const friendService = {
    async searchUserByUsername(username: string){
        const res = await api.get("/users/search", {params: {username}});
        return res.data.user;
    },
    async sendFriendRequest(to:string, message?:string){
        const res = await api.post("/friends/requests", {to, message});
        return {code: res.status, message: res.data.message};
    },
    async getAllFriendRequests(){
        try{
            const res =await api.get("friends/requests");
            const {send, received} = res.data;
            return {send, received};
        }catch(err){
            console.log("Lỗi khi gửi getFriendRequests: ",err);
        }
    },
    async acceptFriendRequest(requestsId: string){
        try{
            const res = await api.put(`/friends/requests/${requestsId}/accept`);
            return res.data.requestAcceptBy;
        }catch(err){
            console.log("Lỗi khi gửi acceptFriendRequest: ",err);
        }
    },
    async declineFriendRequest(requestId:string){
        try{
            await api.delete(`/friends/requests/${requestId}/decline`);
        }catch(err){
            console.log("lỗi khi gọi declineFriendRequest: ",err);
        }
    },
    async getFriendList(){
        try{
            const res = await api.get("/friends");
            return res.data;
        }
        catch(err){
            console.log("Lỗi khi gọi getFriendList: ",err);
        }
    }
}