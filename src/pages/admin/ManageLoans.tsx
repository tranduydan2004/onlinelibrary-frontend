import React, { useState, useEffect } from 'react';
import { getAllLoans, approveLoan, rejectLoan, confirmReturn } from '../../services/adminService';
import { IAdminLoan } from '../../types';

const ManageLoans = () => {
    const [loans, setLoans] = useState<IAdminLoan[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    const fetchLoans = async (pageNumber = 1, currentFromDate: string = fromDate, currentToDate: string = toDate) => {
        try {
            const res = await getAllLoans(pageNumber, pageSize, currentFromDate || undefined, currentToDate || undefined);
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

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchLoans(1, fromDate, toDate);
    };

    const handleClearFilter = () => {
        setFromDate('');
        setToDate('');
        fetchLoans(1, '', '');
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 500,
        marginBottom: 4,
        color: 'var(--color-muted)',
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Đã trả':
                return 'badge badge-success';
            case 'Quá hạn':
                return 'badge badge-danger';
            case 'Đang mượn':
                return 'badge badge-warning';
            case 'Đang chờ duyệt':
                return 'badge badge-neutral';
            case 'Bị từ chối':
                return 'badge badge-neutral';
            default:
                return 'badge badge-soft';
        }
    };

    return (
        <>
            {/* Khối filter */}
            <section className="card" style={{ marginBottom: 16 }}>
                <div className="admin-header">
                    <div>
                        <h2 className="page-title">Quản lý Yêu cầu Mượn/Trả</h2>
                        <p className="page-subtitle">
                        Xem, lọc theo ngày yêu cầu và xử lý các yêu cầu mượn / trả sách từ người dùng.
                        </p>
                    </div>

                    <span className="badge badge-soft">
                        Trên trang: {loans.length} yêu cầu
                    </span>
                </div>

                <form
                    onSubmit={handleFilterSubmit}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 12,
                        alignItems: 'flex-end',
                        marginTop: 4,
                    }}
                >
                    <div style={{ minWidth: 160 }}>
                        <label style={labelStyle}>Từ ngày</label>
                        <input
                        type="date"
                        className="input"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div style={{ minWidth: 160 }}>
                        <label style={labelStyle}>Đến ngày</label>
                        <input
                        type="date"
                        className="input"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit" className="btn btn-primary">
                        Lọc
                        </button>
                        {(fromDate || toDate) && (
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleClearFilter}
                        >
                            Xóa bộ lọc
                        </button>
                        )}
                    </div>
                </form>
            </section>

            {/* Bảng danh sách */}
            <section className="card table-card">
                <h3 className="page-subtitle" style={{ marginBottom: 10 }}>
                Danh sách yêu cầu mượn / trả
                </h3>
                <table className="table-modern">
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
                        {loans.length > 0 ? (
                            loans.map((loan) => (
                                <tr key={loan.id}>
                                    <td>{loan.id}</td>
                                    <td>{loan.bookTitle}</td>
                                    <td>{loan.username}</td>
                                    <td>{new Date(loan.requestDate).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <span className={getStatusBadgeClass(loan.status)}>
                                        {loan.status}
                                        </span>
                                    </td>

                                    <td className='loan-actions'>
                                        {loan.status === 'Đang chờ duyệt' && (
                                        <div className='loan-actions-inner'>
                                            <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleApprove(loan.id)}
                                            >
                                            Duyệt
                                            </button>
                                            <button
                                            className="btn btn-ghost btn-sm"
                                            style={{ marginLeft: 8 }}
                                            onClick={() => handleReject(loan.id)}
                                            >
                                            Từ chối
                                            </button>
                                        </div>
                                        )}

                                        {(loan.status === 'Đang mượn' ||
                                        loan.status === 'Quá hạn') && (
                                            <div className='loan-actions-inner'>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleReturn(loan.id)}
                                                >
                                                    Xác nhận trả
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: 12 }}>
                                Không có yêu cầu mượn/trả nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                        className="btn btn-ghost"
                        disabled={page === 1}
                        onClick={() => fetchLoans(page - 1)}
                        >
                        Trang trước
                        </button>

                        <span>
                        Trang {page}/{totalPages}
                        </span>

                        <button
                        className="btn btn-ghost"
                        disabled={page === totalPages}
                        onClick={() => fetchLoans(page + 1)}
                        >
                        Trang sau
                        </button>
                    </div>
                )}
            </section>
        </>
    );
};

export default ManageLoans;