import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashBoard: React.FC = () => {
    return ( 
        <div>
            <h1>Trang Quản Trị</h1>
            <nav>
                <Link to="/admin" style={{ marginRight: '10px' }}>Quản lý Mượn/Trả</Link>
                <Link to="/admin/books" style={{ marginRight: '10px' }}>Quản lý Sách</Link>
                <Link to="/admin/users" style={{ marginRight: '10px' }}>Quản lý Người Dùng</Link>
            </nav>

            <div style={{ marginTop: '20px'}}>
                {/* <Outlet />:
                  React Router sẽ tự động render component con (ManageLoans, ManageBooks, ...)
                  tương ứng với URL vào vị trí này.
                */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashBoard;