import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ background: '#333', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Thư viện</Link>
                {user?.role === 'Admin' && (
                    <Link to="/admin" style={{ color: 'white' }}>Quản Trị</Link>
                )}
                {user?.role === 'User' && (
                    <Link to="/history" style={{ color: 'white' }}>Lịch sử mượn</Link>
                )}
            </div>

            <div>
                {user ? (
                    <>
                      <span style={{ marginRight: '1rem' }}>Xin chào, {user.username}!</span>
                      <button onClick={handleLogout}>Đăng xuất</button>
                    </>
                ) : (
                    <>
                      <Link to="/login" style={{ color: 'white', marginRight: '1rem'}}>Đăng nhập</Link>
                      <Link to="/register" style={{ color: 'white' }}>Đăng ký</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;