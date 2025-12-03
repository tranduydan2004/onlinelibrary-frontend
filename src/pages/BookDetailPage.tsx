import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById } from '../services/bookService';
import { requestLoan } from '../services/loanService';
import { IBook } from '../types';

const BookDetailPage: React.FC = () => {
    const [book, setBook] = useState<IBook | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{marginBottom: '10px'}}>← Quay lại</button>
            
            <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap' }}>
                {/* Cột ảnh */}
                <div style={{ flex: '0 0 200px' }}>
                     <img 
                        src={book.coverImageUrl || 'https://via.placeholder.com/200x300'} 
                        alt={book.title} 
                        style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }} 
                    />
                </div>

                {/* Cột thông tin */}
                <div style={{ flex: 1 }}>
                    <h1 className="page-title" style={{marginBottom: '5px'}}>{book.title}</h1>
                    <p style={{ color: 'var(--color-muted)', marginBottom: '20px', fontSize: '1.1rem' }}>{book.author}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        <div>
                            <strong>Thể loại:</strong> <span className="badge badge-soft">{book.genre}</span>
                        </div>
                        <div>
                            <strong>Tình trạng:</strong> {book.quantity > 0 ? <span style={{color: 'green'}}>Còn sách ({book.quantity})</span> : <span style={{color: 'red'}}>Hết sách</span>}
                        </div>
                    </div>

                    {message && <p style={{ color: '#10b981', fontWeight: 500, marginBottom: '10px' }}>{message}</p>}
                    {error && <p style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</p>}

                    <button
                        className="btn btn-primary"
                        onClick={handleBorrow}
                        disabled={book.quantity === 0}
                        style={{ padding: '10px 24px' }}
                    >
                        {book.quantity === 0 ? 'Đã hết sách' : 'Đăng ký mượn'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;