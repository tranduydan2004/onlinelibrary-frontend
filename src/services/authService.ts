import api from './api';

// Đăng nhập
export const login = async (username: string, password: string) => {
  return api.post('/auth/login', { 
    Username: username,
    Password: password 
  });
};

// Đăng ký
export const register = async (username: string, password: string) => {
  return api.post('/auth/register', { 
    Username: username,
    Password: password 
  });
};