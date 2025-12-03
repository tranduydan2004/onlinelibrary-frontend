import api from './api';

// Đăng nhập
export const login = async (username: string, password: string) => {
  return api.post('/auth/login', { 
    Username: username,
    Password: password,
  });
};

// Đăng ký
export const register = async (username: string, password: string, email: string, phoneNumber: string) => {
  return api.post('/auth/register', { 
    Username: username,
    Password: password,
    Email: email,
    PhoneNumber: phoneNumber,
  });
};

// Xác thực email bằng OTP
export const verifyEmail = async (username: string, otpCode: string) => {
  return api.post('/auth/verify-email', {
    Username: username,
    OtpCode: otpCode,
  });
};

export const forgotPassword = (usernameOrEmail: string) => {
  return api.post('/auth/forgot-password', {
    UsernameOrEmail: usernameOrEmail,
  });
};

export const resetPassword = (username: string, otpCode: string, newPassword: string) => {
  return api.post('/auth/reset-password', {
    Username: username,
    OtpCode: otpCode,
    NewPassword: newPassword,
  });
};