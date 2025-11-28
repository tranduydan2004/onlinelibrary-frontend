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
        <div>
            <h3>Quản lý Người Dùng</h3>
            <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Đăng nhập</th>
                        <th>Vai trò (Role)</th>
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
                            <td>{user.isLocked ? 'Đã khóa' : 'Hoạt động'}</td>
                            <td>
                                {user.role !== 'Admin' && (
                                    <button onClick={() => handleToggleLock(user.id)}>
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
                <div style={{ marginTop: '10px' }}>
                    <button disabled={page === 1} onClick={() => fetchUser(page - 1)}>
                        Trang trước
                    </button>

                    <span style={{ margin: '0 8px' }}>
                        Trang {page}/{totalPages}
                    </span>

                    <button disabled={page === totalPages} onClick={() => fetchUser(page + 1)}>
                        Trang sau
                    </button>

                </div>
            )}
        </div>
    );
};

export default ManageUser;