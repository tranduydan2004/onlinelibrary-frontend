import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchBooksByGenre } from '../services/bookService';
import { IBook } from '../types';
import { requestLoan } from '../services/loanService';

const BooksByGenrePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const genre = decodeURIComponent(searchParams.get('genre') || '');

    const [books, setBooks] = useState<IBook[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10; // Số sách mỗi trang

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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

    return (
        <div>
            <h1 className="page-title">Kho sách: {genre}</h1>
            <p className="page-subtitle">Các đầu sách thuộc thể loại {genre}</p>

            {message && <div style={{ padding: '10px', background: '#d1fae5', color: '#065f46', borderRadius: '8px', marginBottom: '16px' }}>{message}</div>}

            <div className="book-grid">
                {books.map((book) => (
                    <div key={book.id} className="book-card">
                        <img 
                            src={book.coverImageUrl || 'https://via.placeholder.com/150x200?text=No+Image'} 
                            alt={book.title} 
                            className="book-cover"
                        />
                        <div style={{ flex: 1 }}>
                            <h3 className="book-title" title={book.title} style={{whiteSpace: 'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{book.title}</h3>
                            <p className="book-author">{book.author}</p>
                        </div>
                        
                        <div className="book-meta-row">
                            <span className={`badge ${book.quantity > 0 ? 'badge-soft' : ''}`} style={{background: book.quantity > 0 ? '' : '#f3f4f6', color: book.quantity > 0 ? '' : '#9ca3af'}}>
                                {book.quantity > 0 ? `Còn: ${book.quantity}` : 'Hết sách'}
                            </span>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '8px', fontSize: '0.8rem' }}
                            onClick={() => handleBorrow(book.id)}
                            disabled={book.quantity === 0}
                        >
                            {book.quantity === 0 ? 'Hết sách' : 'Mượn ngay'}
                        </button>
                    </div>
                ))}
            </div>

            {books.length === 0 && <p style={{textAlign: 'center', marginTop: 20}}>Chưa có sách nào.</p>}

            {totalPages > 1 && (
                <div className="pagination" style={{ justifyContent: 'center', marginTop: '30px' }}>
                    <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                        Trước
                    </button>
                    <span style={{ fontWeight: 600 }}>Trang {page}/{totalPages}</span>
                    <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default BooksByGenrePage;