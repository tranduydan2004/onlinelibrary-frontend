import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashBoard: React.FC = () => {
    const location = useLocation();

    const tabClass = (path: string) => location.pathname === path ? 'admin-tab admin-tab-active' : 'admin-tab';

    return ( 
        <section className="card">
            <div className="admin-header">
                <div>
                <h1 className="page-title">Khu vực quản trị</h1>
                <p className="page-subtitle">
                    Quản lý yêu cầu mượn/trả, danh mục sách và tài khoản người dùng.
                </p>
                </div>

                <div className="admin-tabs">
                <Link to="/admin" className={tabClass('/admin')}>
                    Mượn / Trả
                </Link>
                <Link to="/admin/books" className={tabClass('/admin/books')}>
                    Sách
                </Link>
                <Link to="/admin/users" className={tabClass('/admin/users')}>
                    Người dùng
                </Link>
                </div>
            </div>

            <div className="table-card">
                <Outlet />
            </div>
        </section>
    );
};

export default AdminDashBoard;