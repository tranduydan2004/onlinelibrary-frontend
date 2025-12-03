import React, { useState, useEffect} from 'react';
import { getAllUsers, toggleUserLock } from '../../services/adminService';
import { IAdminUser } from '../../types';

const ManageUser = () => {
    const [users, setUsers] = useState<IAdminUser[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const fetchUser = async (pageNumber = 1) => {
        try {
            const res = await getAllUsers(pageNumber, pageSize);
            setUsers(res.data.items);
            setPage(res.data.pageNumber);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
        }
    };

    useEffect(() => { fetchUser(1); }, []);

    const handleToggleLock = async (userId: number) => {
        try {
            await toggleUserLock(userId);
            fetchUser(page);
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái khóa/mở khóa người dùng:", error);
            alert('Không thể khóa tài khoản Admin.');
        }
    };

    return (
        <div className='card table-card'>
            <h3 className="page-title" style={{ fontSize: '1.1rem' }}>Quản lý Người Dùng</h3>
            <table className='table-modern'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Đăng nhập</th>
                        <th>Vai trò (Role)</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user =>
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{user.isLocked ? 'Đã khóa' : 'Hoạt động'}</td>
                            <td>
                                {user.role !== 'Admin' && (
                                    <button className='btn btn-ghost' onClick={() => handleToggleLock(user.id)}>
                                        {user.isLocked ? 'Mở khóa' : 'Khóa'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className='pagination'>
                    <button className='btn btn-ghost' disabled={page === 1} onClick={() => fetchUser(page - 1)}>
                        Trang trước
                    </button>

                    <span>
                        Trang {page}/{totalPages}
                    </span>

                    <button className='btn btn-ghost' disabled={page === totalPages} onClick={() => fetchUser(page + 1)}>
                        Trang sau
                    </button>

                </div>
            )}
        </div>
    );
};

export default ManageUser;