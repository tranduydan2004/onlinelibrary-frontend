import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path ? 'nav-link nav-link-active' : 'nav-link';

    const firstLetter = user?.username?.charAt(0).toUpperCase() ?? 'G';

    return (
        <header className="main-header">
            <div className="main-header-inner">
                <Link to="/" className="brand">
                <div className="brand-logo">📚</div>
                <div className="brand-text">
                    <span className="brand-title">OnlineLibrary</span>
                    <span className="brand-sub">Đọc – Mượn – Quản lý sách dễ dàng</span>
                </div>
                </Link>

                <nav className="nav-links">
                <Link to="/" className={isActive('/')}>
                    Thư viện
                </Link>

                {user?.role === 'User' && (
                    <>
                    <Link to="/history" className={isActive('/history')}>
                        Lịch sử mượn
                    </Link>
                    <Link to="/profile" className={isActive('/profile')}>
                        Trang cá nhân
                    </Link>
                    <Link to="/genres" className={isActive('/genres')}>
                        Thể loại
                    </Link>
                    </>
                )}

                {user?.role === 'Admin' && (
                    <>
                    <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'nav-link nav-link-active' : 'nav-link'}>
                    Quản trị
                    </Link>

                    <Link to="/genres" className={isActive('/genres')}>
                        Thể loại
                    </Link>
                    </>
                )}
                </nav>

                <div className="nav-user">
                {user ? (
                    <>
                    <div className="nav-avatar">{firstLetter}</div>
                    <span>Xin chào, {user.username}!</span>
                    <button className="btn btn-ghost" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                    </>
                ) : (
                    <>
                    <Link to="/login" className="btn btn-ghost">
                        Đăng nhập
                    </Link>
                    <Link to="/register" className="btn btn-primary">
                        Đăng ký
                    </Link>
                    </>
                )}
                </div>
            </div>
        </header>
    );
};

export default Header;