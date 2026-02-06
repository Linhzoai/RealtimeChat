import api from "../lib/axios";
export const authService = {
    signUp: async (username: string, password: string, email: string, firstName: string, lastName: string, phoneNumber: string) => {
        try{
            const data = {
                username,
                password,
                email,
                firstName,
                lastName,
                phoneNumber,
            }
            await api.post("/auth/signup", data);
            return ;
        }
        catch(error){
            console.log(error);
            throw error;
        }
    },
    signIn: async (username: string, password: string) => {
        const response = await api.post("/auth/signin", {username, password});
        return response.data;
    },
    signOut: async() =>{
        await api.post("/auth/signout");
    },

    fetchMe: async () =>{
        const {data} = await api.get("/users/me");
        return data;
    },
    refresh: async () =>{
        const res = await api.get("/auth/refresh-token");
        return res.data.accessToken;
    }
}
