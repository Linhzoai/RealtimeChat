import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8080/api/' : '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

api.interceptors.response.use( (res) => res, async (err) => {
        if (!err.response) return Promise.reject(err);

        const originalRequest = err.config;

        if (
            originalRequest.url.includes('/signin') ||
            originalRequest.url.includes('/signup') ||
            originalRequest.url.includes('/refresh-token')
        ){
            return Promise.reject(err);
        }
        originalRequest._retry = originalRequest._retry || 0;

        if (err.response.status === 403 && originalRequest._retry < 4) {
            originalRequest._retry++;

            try {
                const res = await api.get('/auth/refresh-token');

                const newAccessToken = res.data.accessToken;

                useAuthStore.setState({ accessToken: newAccessToken });

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };

                return api(originalRequest);
            } catch (e) {
                useAuthStore.getState().clearState();
                return Promise.reject(e);
            }
        }

        return Promise.reject(err);
    }
);

export default api;