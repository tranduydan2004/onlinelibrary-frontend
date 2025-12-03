import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Thêm prop 'adminOnly'
const ProtectedRoute = ({ adminOnly = false } : { adminOnly?: boolean }) => {
    const { user, loading } = useAuth(); //1. Lấy biến loading

    //2. Nếu đang khôi phục session thì return null hoặc Spinner loading
    if (loading) {
        // Hiển thị loading hoặc một thành phần chờ khi đang kiểm tra xác thực
        return <div>Loading...</div>;
    }

    if (!user) {
        //3. Chưa đăng nhập -> Về trang login
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'Admin') {
        //4. Yêu cầu Admin, nhưng user không phải Admin -> Về trang chủ
        return <Navigate to="/" replace />;
    }

    //5. Đã đăng nhập và đúng quyền
    return <Outlet />;
};

export default ProtectedRoute;