import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // URL backend (Docker container)
const api = axios.create({
    baseURL: API_URL,
});

// Interceptor để tự động đính kèm token vào header của mỗi request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;