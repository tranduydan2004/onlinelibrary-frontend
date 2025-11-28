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
            <h2>Lịch sử mượn sách</h2>
            <ul>
                {history.map((loan) => (
                    <li key={loan.id}>
                        {loan.bookTitle} - {loan.status}
                        {loan.status === 'Đang mượn' && (
                            <button onClick={() => handleExtend(loan.id)}>Gia hạn</button>
                        )}
                    </li>
                ))}
            </ul>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div>
                    <button disabled={page === 1} onClick={() => handleChangePage(page - 1)}>
                        Trang trước
                    </button>

                    <span style={{ margin: '0 8px'}}>
                        Trang {page}/{totalPages}
                    </span>

                    <button disabled={page === totalPages} onClick={() => handleChangePage(page + 1)}>
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoanHistoryPage;