import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Thêm prop 'adminOnly'
const ProtectedRoute = ({ adminOnly = false }) => {
    const { user } = useAuth();

    if (!user) {
        //1. Chưa đăng nhập -> Về trang login
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'Admin') {
        //2. Yêu cầu Admin, nhưng user không phải Admin -> Về trang chủ
        return <Navigate to="/" replace />;
    }

    //3. Đã đăng nhập và đúng quyền
    return <Outlet />;
};

export default ProtectedRoute;