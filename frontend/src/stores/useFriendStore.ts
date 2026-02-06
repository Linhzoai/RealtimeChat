import { friendService } from '@/services/friendService.ts';
import type { FriendState } from '@/types/user';
import { create } from 'zustand';

export const useFriendStore = create<FriendState>((set) => ({
    loading: false,
    friendList: [], 
    receivedList: [],
    sendList: [],
    searchByUsername: async (username) => {
        set({ loading: true });
        try {
            if (!username || username.trim() === '') {
                return null;
            }
            const user = await friendService.searchUserByUsername(username);
            return user;
        } catch (err) {
            console.log('Lỗi khi tìm kiếm user: ', err);
            return null;
        } finally {
            set({ loading: false });
        }
    },
    addFriend: async (to, message) => {
        set({ loading: true });
        try {
            if (!to) {
                return { code: 400, message: 'Thiếu thông tin người nhận' };
            }
            const { code, message: notify } =
                await friendService.sendFriendRequest(to, message);
            return { code, message: notify };
        } catch (err) {
            return {
                code: 500,
                message:
                    (err as any)?.response?.data?.message ||
                    'Lỗi khi gửi yêu cầu kết bạn',
            };
        } finally {
            set({ loading: false });
        }
    },
    getAllFriendRequests: async () =>{
        try{
            set({loading: true});
            const result = await friendService.getAllFriendRequests();
            if(!result) return;
            const {send, received}= result;
            set({receivedList: received, sendList: send});
        }catch(err){
            console.log("Lỗi khi lấy danh sách yêu cầu kết bạn: ", err);
        }finally{
            set({loading: false});
        }
    },
    acceptFriendRequest: async (requestId)=>{
        try{
            set({loading: true});
            await friendService.acceptFriendRequest(requestId);
            set((state)=>({
                receivedList: state.receivedList.filter((r)=> r._id !== requestId)
            }))
        }catch(err){
            console.log("Lỗi khi chấp nhận yêu cầu kết bạn: ", err);
        }finally{
            set({loading: false});
        }
    },
    declineFriendRequest: async(requestId)=>{
        try{
            set({loading:true});
            await friendService.declineFriendRequest(requestId);
            set((state)=>({receivedList: state.receivedList.filter((r)=> r._id !== requestId)}))
        }catch(err){
            console.log("Lỗi khi từ chối yêu cầu kết bạn: ", err);
        }finally{
            set({loading: false});
        }
    },
    getFriendList: async ()=>{
        try{
            set({loading: true});
            const result = await friendService.getFriendList();
            if(!result) return;
            set({friendList: result.friend});
        }
        catch(err){
            console.log("Lỗi khi lấy danh sách bạn bè: ", err);
            set({friendList: []})
        }
        finally{
            set({loading: false});
        }
    }
}));
