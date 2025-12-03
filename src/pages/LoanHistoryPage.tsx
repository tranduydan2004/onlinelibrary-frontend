import React, { useState, useEffect } from 'react';
import { getLoanHistory, extendLoan } from '../services/loanService';
import { ILoanRequest } from '../types';

const LoanHistoryPage: React.FC = () => {
    const [history, setHistory] = useState<ILoanRequest[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const fetchHistory = async (pageNumber = 1) => {
        try {
            const response = await getLoanHistory(pageNumber, pageSize);
            setHistory(response.data.items);
            setPage(response.data.pageNumber);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử mượn: ", error)
        }
    };

    useEffect(() => { fetchHistory(1); }, []);

    const handleChangePage = (newPage: number) => {
        // Kiểm tra giới hạn trang
        if (newPage < 1 || newPage > totalPages) return;
        fetchHistory(newPage);
    }

    const handleExtend = async (loanId: number) => {
        if (window.confirm("Bạn có chắc chắn muốn gia hạn sách này?")) {
            try {
                await extendLoan(loanId);
                alert("Gia hạn thành công!");
                fetchHistory(page); // Tải lại lịch sử sau khi gia hạn
            } catch (error) {
                const err = error as any;
                const message = err?.response?.data?.error ?? String(err) ?? 'Không xác định';
                alert("Gia hạn thất bại: " + message);
            }
        }
    };

    return (
        <div>
            <h1 className="page-title">Lịch sử mượn trả</h1>
            <div className="card">
                <table className="table-modern" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Sách</th>
                            <th>Trạng thái</th>
                            <th>Hạn trả</th>
                            <th style={{textAlign: 'right'}}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((loan) => (
                            <tr key={loan.id}>
                                <td style={{fontWeight: 500}}>{loan.bookTitle}</td>
                                <td>
                                    <span className="badge" style={{
                                        backgroundColor: loan.status === 'Đang mượn' ? '#dbeafe' : '#f3f4f6',
                                        color: loan.status === 'Đang mượn' ? '#1e40af' : '#374151'
                                    }}>
                                        {loan.status}
                                    </span>
                                </td>
                                <td>
                                    {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString('vi-VN') : '-'}
                                </td>
                                <td style={{textAlign: 'right'}}>
                                    {loan.status === 'Đang mượn' && (
                                        loan.canExtend ? (
                                            <button className="btn btn-ghost" style={{padding: '4px 10px', fontSize: '0.8rem'}} onClick={() => handleExtend(loan.id)}>
                                                Gia hạn
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Hết lượt gia hạn</span>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                         {history.length === 0 && (
                            <tr><td colSpan={4} style={{textAlign: 'center'}}>Chưa có lịch sử mượn.</td></tr>
                        )}
                    </tbody>
                </table>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="btn btn-ghost" disabled={page === 1} onClick={() => handleChangePage(page - 1)}>Trước</button>
                        <span>{page}/{totalPages}</span>
                        <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => handleChangePage(page + 1)}>Sau</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanHistoryPage;