import { create } from "zustand";
import {toast} from "sonner";
import { authService } from "../services/authService";
import type {AuthState} from "../types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";
export const useAuthStore = create<AuthState>()(
    persist((set, get)=> 
        ({
        accessToken: null,
        loading: false,
        user: null,
        callback: 1,
        clearState: () => {
            set( { accessToken: null, loading: false, user: null });
            useChatStore.getState().reset();
            localStorage.clear();
            sessionStorage.clear();
        },
        signUp: async (username, password, email, firstName, lastName, phoneNumber) => {
            try{
                get().clearState();
                set({loading: true});
                await authService.signUp(username, password, email, firstName, lastName, phoneNumber);
                //gọi api
                toast.success("Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.");
                return ;
            }
            catch(error){
                toast.error("Đăng ký thất bại");
                throw error;
            }
            finally{
                set({loading: false});
            }
        },

        signIn: async (username, password) =>{
            try{
                localStorage.clear();
                useChatStore.getState().reset();
                set({loading: true});
                const data= await authService.signIn(username, password);
                set({accessToken: data.accessToken});
                get().fetchMe();
                useChatStore.getState().fetchConversation();
                toast.success("Đăng nhập thành công!");
                return;
            }
            catch(error){
                toast.error("Tên đăng nhập hoặc mật khẩu không chính xác");
                throw error;
            }
            finally{
                set({loading: false});
            }
        },

        signOut: async()=>{
            try{
                set({loading: true});
                await authService.signOut();
                get().clearState();
                toast.success("Đăng xuất thành công!");
            }
            catch(error){
                toast.error("Đăng xuất thất bại");
                throw error;
            }
            finally{
                set({loading: false});
            }
        },
        fetchMe: async() =>{
            try{
                set({loading: true});
                const data = await authService.fetchMe();
                set({user: data.user});
            }
            catch(error){
                toast.error("Lỗi khi lấy thông tin người dùng");
                throw error;
            }
            finally{
                set({loading: false});
            }
        },
        refresh: async () =>{
            try{
                set({loading: true});
                const {user, fetchMe} = get();
                const accessToken = await authService.refresh();
                set({accessToken});
                if(!user){
                    fetchMe();
                }
            }
            catch(error){
                toast.error("Lỗi khi lấy thông tin người dùng");
                console.log(error);
                get().clearState();
            }
            finally{
                set({loading: false});
            }
        },
        hydrateFromStorage: () => {
            const stored = localStorage.getItem('auth-storage');
            if (stored) {
                const parsed = JSON.parse(stored);
                set(parsed.state);
            }
            return;
        },
        setUser: (user) => {
            set({ user });
        }

    }),
    {
        name: "auth-storage",
        partialize: (state)=>({user: state.user})
    }
)
)