import React, { useState, useEffect} from 'react';
import { getAllUsers, toggleUserLock, getLockedUsers } from '../../services/adminService';
import { IAdminUser } from '../../types';

type UserFilterMode = 'ALL' | 'LOCKED_ONLY';

const ManageUser = () => {
    const [users, setUsers] = useState<IAdminUser[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const [filterMode, setFilterMode] = useState<UserFilterMode>('ALL');
    const [loading, setLoading] = useState(false);

    const fetchUser = async (pageNumber = 1, mode: UserFilterMode = filterMode) => {
        try {
            setLoading(true);

            if (mode === 'ALL') {
                const res = await getAllUsers(pageNumber, pageSize);
                setUsers(res.data.items);
                setPage(res.data.pageNumber);
                setTotalPages(res.data.totalPages);
            }
            else {
                const res = await getLockedUsers();
                setUsers(res.data);
                setPage(1);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    const changeFilterMode = (mode: UserFilterMode) => {
        setFilterMode(mode);
        fetchUser(1, mode);
    };

    useEffect(() => { fetchUser(1, 'ALL'); }, []);

    const handleToggleLock = async (userId: number) => {
        try {
            await toggleUserLock(userId);
            fetchUser(filterMode === 'ALL' ? page : 1, filterMode);
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái khóa/mở khóa người dùng:", error);
            alert('Không thể khóa tài khoản Admin.');
        }
    };

    return (
        <div className="card table-card">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                    gap: 8,
                    flexWrap: 'wrap',
                }}
            >
                <h3 className="page-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                    Quản lý Người Dùng
                </h3>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        className={`btn ${filterMode === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => changeFilterMode('ALL')}
                    >
                        Tất cả
                    </button>
                    <button
                        type="button"
                        className={`btn ${filterMode === 'LOCKED_ONLY' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => changeFilterMode('LOCKED_ONLY')}
                    >
                        Chỉ tài khoản bị khóa
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '12px 0' }}>Đang tải...</div>
            ) : (
                <>
                    <table className="table-modern">
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
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center' }}>
                                        Không có người dùng nào.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.role}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td>{user.isLocked ? 'Đã khóa' : 'Hoạt động'}</td>
                                        <td>
                                            {user.role !== 'Admin' && (
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => handleToggleLock(user.id)}
                                                >
                                                    {user.isLocked ? 'Mở khóa' : 'Khóa'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Phân trang: chỉ dùng khi xem TẤT CẢ */}
                    {filterMode === 'ALL' && totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="btn btn-ghost"
                                disabled={page === 1}
                                onClick={() => fetchUser(page - 1, 'ALL')}
                            >
                                Trang trước
                            </button>

                            <span>
                                Trang {page}/{totalPages}
                            </span>

                            <button
                                className="btn btn-ghost"
                                disabled={page === totalPages}
                                onClick={() => fetchUser(page + 1, 'ALL')}
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageUser;