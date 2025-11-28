import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById } from '../services/bookService';
import { requestLoan } from '../services/loanService';
import { IBook } from '../types';

const BookDetailPage: React.FC = () => {
    const [book, setBook] = useState<IBook | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            const fetchBook = async () => {
                try {
                    const response = await getBookById(Number(id));
                    setBook(response.data);
                } catch (err) {
                    setError('Không tìm thấy sách hoặc có lỗi xảy ra.');
                }
            };
            fetchBook();
        }
    }, [id]);

    const handleBorrow = async () => {
        if (!book) return;
        setMessage('');
        setError('');
        try {
            await requestLoan(book.id);
            setMessage('Yêu cầu mượn sách thành công!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Không thể mượn sách');
        }
    };

    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!book) return <div>Đang tải thông tin sách...</div>;

    return (
        <div>
            <h1>{book.title}</h1>
            <p><strong>Tác giả:</strong> {book.author}</p>
            <p><strong>Thể loại:</strong> {book.genre}</p>
            <p><strong>Số lượng còn:</strong> {book.quantity}</p>
            <p>
                {book.coverImageUrl ? <img src={book.coverImageUrl} alt={book.title} style={{ width: '100px', height: '150px', objectFit: 'cover' }} /> : 'Chưa có ảnh'}
            </p>

            <button
                onClick={handleBorrow}
                disabled={book.quantity === 0}>
                    {book.quantity === 0 ? 'Đã hết sách' : 'Mượn sách'}
            </button>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red'}}>{error}</p>}
        </div>
    );
};

export default BookDetailPage;