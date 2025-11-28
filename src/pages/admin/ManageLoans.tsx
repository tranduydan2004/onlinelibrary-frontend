import React, { useState, useEffect } from 'react';
import { getAllLoans, approveLoan, rejectLoan, confirmReturn } from '../../services/adminService';
import { IAdminLoan } from '../../types';

const ManageLoans = () => {
    const [loans, setLoans] = useState<IAdminLoan[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const fetchLoans = async (pageNumber = 1) => {
        try {
            const res = await getAllLoans(pageNumber, pageSize);
            setLoans(res.data.items);
            setPage(res.data.pageNumber);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách mượn/trả: ", error);
        }
    };

    useEffect(() => { fetchLoans(1) }, []);

    const handleApprove = async (id: number) => {
        try {
            await approveLoan(id);
            fetchLoans(page);
        } catch (error) {
            console.error("Lỗi khi duyệt yêu cầu mượn: ", error);
        }
    };

    const handleReject = async (id: number) => {
        try {
            await rejectLoan(id);
            fetchLoans(page);
        } catch (error) {
            console.error("Lỗi khi từ chối yêu cầu mượn: ", error);
        }
    };

    const handleReturn = async (id: number) => {
        try {
            await confirmReturn(id);
            fetchLoans(page);
        } catch (error) {
            console.error("Lỗi khi xác nhận trả sách: ", error);
        }
    };

    return (
        <div>
            <h3>Quản lý Yêu cầu Mượn/Trả</h3>
            <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Sách</th>
                        <th>Người mượn</th>
                        <th>Ngày yêu cầu</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {loans.length > 0 ? loans.map(loan => (
                        <tr key={loan.id}>
                            <td>{loan.id}</td>
                            <td>{loan.bookTitle}</td>
                            <td>{loan.username}</td>
                            <td>{new Date(loan.requestDate).toLocaleDateString()}</td>
                            <td>{loan.status}</td>
                            <td>
                                {loan.status === 'Đang chờ duyệt' && (
                                    <>
                                      <button onClick={() => handleApprove(loan.id)} style={{ marginRight: '5px' }}>Duyệt</button>
                                      <button onClick={() => handleReject(loan.id)}>Từ chối</button>
                                    </>
                                )}
                                {(loan.status === 'Đang mượn' || loan.status === 'Quá hạn') && (
                                    <button onClick={() => handleReturn(loan.id)}>Xác nhận trả</button>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>Không có yêu cầu mượn/trả nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div style={{ marginTop: '10px' }}>
                    <button disabled={page === 1} onClick={() => fetchLoans(page - 1)}>
                        Trang trước
                    </button>

                    <span style={{ margin: '0 8px' }}>
                        Trang {page}/{totalPages}
                    </span>

                    <button disabled={page === totalPages} onClick={() => fetchLoans(page + 1)}>
                        Trang sau
                    </button>

                </div>
            )}
        </div>
    );
};

export default ManageLoans;