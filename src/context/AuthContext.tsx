import React, { createContext, useState, useEffect } from 'react';
import { IUser } from '../types';
import { login as loginService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    user: IUser | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType>(null!);

// Helper đọc đúng key từ JWT của .NET
const mapTokenToUser = (token: string): IUser => {
    const decoded: any = jwtDecode(token);

    return {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
    };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        // Kiểm tra token trong localStorage khi tải trang
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const mappedUser = mapTokenToUser(token);
                setUser(mappedUser);
            }
            catch (error) {
                console.error("Token không hợp lệ:", error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = async (username: string, password: string) => {
        const response = await loginService(username, password);
        const { token } = response.data;

        localStorage.setItem('token', token);

        const mappedUser = mapTokenToUser(token);
        setUser(mappedUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};