import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8080/api'; // URL backend (Docker container)
const api = axios.create({
    baseURL: API_URL,
});

// Interceptor để tự động đính kèm token vào header của mỗi request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor: auto logout khi 403 (bị khóa / forbidden)
api.interceptors.response.use(response => response,
    (error: AxiosError<any>) => {
        const status = error.response?.status;

        if (status === 403) {
            const serverError = 
                (error.response?.data as any)?.error ||
                (error.response?.data as any)?.message;

            // Xóa thông tin đăng nhập phía client
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Lưu message để màn hình Login hiển thị (tùy chọn)
            if (serverError) {
                sessionStorage.setItem('lockedMessage', serverError);
            }

            // Chuyển hướng về trang login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login?locked=1';
            }
        }
        return Promise.reject(error);
    }
)

export default api;