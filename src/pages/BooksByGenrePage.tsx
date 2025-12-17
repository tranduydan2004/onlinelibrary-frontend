import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchBooksByGenre } from '../services/bookService';
import { IBook } from '../types';
import { requestLoan } from '../services/loanService';
import { useAuth } from '../hooks/useAuth';

const BooksByGenrePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const genre = decodeURIComponent(searchParams.get('genre') || '');

    const [books, setBooks] = useState<IBook[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10; // Số sách mỗi trang

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!genre) return; // Nếu không có thể loại, không làm gì

        const fetchBooks = async () => {
            try {
                const res = await searchBooksByGenre(genre, page, pageSize);
                setBooks(res.data.items);
                setPage(res.data.pageNumber);
                setTotalPages(res.data.totalPages);
                setError('');
            } catch (err) {
                console.error("Lỗi khi tải danh sách theo thể loại", err);
                setError("Không thể tải danh sách sách theo thể loại.");
            }
        };

        fetchBooks();
    }, [genre, page]);

    const handleBorrow = async (bookId: number) => {
        setMessage('');
        setError('');

        //1. Chưa đăng nhập -> chuyển login
        if (!user) {
            setError('Bạn cần đăng nhập để mượn sách.');
            navigate('/login');
            return;
        }

        //2. Không phải role User
        if (user.role !== 'User') {
            setError('Tài khoản của bạn không có quyền mượn sách. Vui lòng dùng tài khoản người dùng.');
            return;
        }

        try {
            await requestLoan(bookId);
            setMessage('Yêu cầu mượn sách đã được gửi thành công!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Không thể mượn sách');
        }
    };

    if (!genre) {
        return <p>Không xác định được thể loại</p>;
    }

    // Chỉ tài khoản User mới có thể mượn sách
    const canBorrow = !!user && user.role === 'User';

    return (
        <div>
            <h1 className="page-title">Kho sách: {genre}</h1>
            <p className="page-subtitle">Các đầu sách thuộc thể loại {genre}</p>

            {message && (
                <div
                    style={{
                        padding: '10px',
                        background: '#d1fae5',
                        color: '#065f46',
                        borderRadius: '8px',
                        marginBottom: '16px',
                    }}
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: '10px',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        borderRadius: '8px',
                        marginBottom: '16px',
                    }}
                >
                    {error}
                </div>
            )}

            <div className="book-grid">
                {books.map((book) => {
                    const disabled = book.quantity === 0 || !canBorrow;
                    const buttonText = !canBorrow
                        ? 'Đăng nhập để mượn'
                        : book.quantity === 0
                        ? 'Hết sách'
                        : 'Mượn ngay';

                    return (
                        <div key={book.id} className="book-card">
                            <img
                                src={
                                    book.coverImageUrl ||
                                    'https://via.placeholder.com/150x200?text=No+Image'
                                }
                                alt={book.title}
                                className="book-cover"
                            />
                            <div style={{ flex: 1 }}>
                                <h3
                                    className="book-title"
                                    title={book.title}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {book.title}
                                </h3>
                                <p className="book-author">{book.author}</p>
                            </div>

                            <div className="book-meta-row">
                                <span
                                    className={`badge ${
                                        book.quantity > 0
                                            ? 'badge-soft'
                                            : 'badge-neutral'
                                    }`}
                                >
                                    {book.quantity > 0
                                        ? `Còn: ${book.quantity}`
                                        : 'Hết sách'}
                                </span>
                            </div>

                            <button
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    marginTop: '8px',
                                    fontSize: '0.8rem',
                                }}
                                onClick={() =>
                                    !disabled && handleBorrow(book.id)
                                }
                                disabled={disabled}
                            >
                                {buttonText}
                            </button>
                        </div>
                    );
                })}
            </div>

            {books.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: 20 }}>
                    Chưa có sách nào.
                </p>
            )}

            {totalPages > 1 && (
                <div
                    className="pagination"
                    style={{ justifyContent: 'center', marginTop: '30px' }}
                >
                    <button
                        className="btn btn-ghost"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Trước
                    </button>
                    <span style={{ fontWeight: 600 }}>
                        Trang {page}/{totalPages}
                    </span>
                    <button
                        className="btn btn-ghost"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default BooksByGenrePage;