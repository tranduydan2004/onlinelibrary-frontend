import React, { useState, useEffect } from 'react';
import { getGenres } from '../services/bookService';
import { IGenre } from '../types';
import { useNavigate } from 'react-router-dom';

const GenrePage: React.FC = () => {
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await getGenres(searchTerm, page, pageSize);
                setGenres(res.data.items);
                //setPage(res.data.pageNumber);
                setTotalPages(res.data.totalPages);
                setError('');
            } catch (err) {
                console.error("Lỗi khi tải danh sách thể loại", err);
                setError("Không thể tải danh sách thể loại.");
            }
        };

        const timerId = setTimeout(fetchGenres, 300);
        return () => clearTimeout(timerId);
    }, [searchTerm, page]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset về trang 1 khi tìm kiếm mới
    };

    const handleGenreClick = (name: string) => {
        navigate(`/genres/books?genre=${encodeURIComponent(name)}`);
    };

    return (
        <div>
            <h1 className="page-title">Quản lý Thể loại</h1>
            <p className="page-subtitle">Danh sách các thể loại sách hiện có trong hệ thống</p>

            <div className="card">
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <input
                        className="input"
                        type="text"
                        placeholder="Tìm kiếm thể loại..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ maxWidth: '300px' }}
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div style={{ overflowX: 'auto' }}>
                    <table className="table-modern" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Tên thể loại</th>
                                <th>Số lượng sách</th>
                                <th style={{ textAlign: 'right' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {genres.map((g) => (
                                <tr key={g.name}>
                                    <td style={{ fontWeight: 500 }}>{g.name}</td>
                                    <td>
                                        <span className="badge badge-soft">{g.bookCount} sách</span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button 
                                            className="btn btn-ghost" 
                                            onClick={() => handleGenreClick(g.name)}
                                        >
                                            Xem sách
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {genres.length === 0 && (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                                        Không tìm thấy dữ liệu.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="btn btn-ghost"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            &laquo; Trước
                        </button>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                            Trang {page} / {totalPages}
                        </span>
                        <button
                            className="btn btn-ghost"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Sau &raquo;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenrePage;