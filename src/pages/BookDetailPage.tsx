import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById } from '../services/bookService';
import { requestLoan } from '../services/loanService';
import { IBook } from '../types';
import { useAuth } from '../hooks/useAuth';

const BookDetailPage: React.FC = () => {
    const [book, setBook] = useState<IBook | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    
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

        //1. Chưa đăng nhập -> chuyển tới trang login
        if (!user) {
            setError('Bạn cần đăng nhập để mượn sách.');
            navigate('/login');
            return;
        }

        //2. Không phải role User -> Chặn
        if (user.role !== 'User') {
            setError('Tài khoản của bạn không có quyền mượn sách. Vui lòng sử dụng tài khoản người dùng.');
            return;
        }

        //3. Hết sách -> Chặn
        if (book.quantity === 0) {
            setError('Rất tiếc, sách này đã hết.');
            return;
        }

        try {
            await requestLoan(book.id);
            setMessage('Yêu cầu mượn sách thành công!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Không thể mượn sách');
        }
    };

    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!book) return <div>Đang tải thông tin sách...</div>;

    // Phân loại trạng thái người dùng
    const isGuest = !user;
    const isAdmin = !!user && user.role === 'Admin';
    const isUser = !!user && user.role === 'User';

    // Chỉ tài khoản User mới có thể mượn sách
    const canBorrow = !!user && user.role === 'User';
    const borrowDisabled = book.quantity === 0 || !canBorrow;

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
                style={{ marginBottom: '10px' }}
            >
                ← Quay lại
            </button>

            <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap' }}>
                {/* Cột ảnh */}
                <div style={{ flex: '0 0 200px' }}>
                    <img
                        src={book.coverImageUrl || 'https://via.placeholder.com/200x300'}
                        alt={book.title}
                        style={{
                            width: '100%',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    />
                </div>

                {/* Cột thông tin */}
                <div style={{ flex: 1 }}>
                    <h1 className="page-title" style={{ marginBottom: '5px' }}>
                        {book.title}
                    </h1>
                    <p
                        style={{
                            color: 'var(--color-muted)',
                            marginBottom: '20px',
                            fontSize: '1.1rem',
                        }}
                    >
                        {book.author}
                    </p>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px',
                            marginBottom: '20px',
                        }}
                    >
                        <div>
                            <strong>Thể loại:</strong>{' '}
                            <span className="badge badge-soft">{book.genre}</span>
                        </div>
                        <div>
                            <strong>Tình trạng:</strong>{' '}
                            {book.quantity > 0 ? (
                                <span style={{ color: 'green' }}>
                                    Còn sách ({book.quantity})
                                </span>
                            ) : (
                                <span style={{ color: 'red' }}>Hết sách</span>
                            )}
                        </div>
                    </div>

                    {message && (
                        <p
                            style={{
                                color: '#10b981',
                                fontWeight: 500,
                                marginBottom: '10px',
                            }}
                        >
                            {message}
                        </p>
                    )}
                    {error && (
                        <p
                            style={{ color: '#ef4444', marginBottom: '10px' }}
                        >
                            {error}
                        </p>
                    )}

                    {canBorrow && (
                        <button
                            className="btn btn-primary"
                            onClick={handleBorrow}
                            disabled={borrowDisabled}
                            style={{ padding: '10px 24px' }}
                        >
                            {book.quantity === 0 ? 'Đã hết sách' : 'Đăng ký mượn'}
                        </button>
                    )}
                    
                    {isGuest && !canBorrow && (
                        <button
                            className="btn btn-ghost"
                            onClick={() => navigate('/login')}
                            style={{ padding: '10px 24px' }}
                        >
                            Đăng nhập để mượn sách
                        </button>
                    )}

                    {isAdmin && !canBorrow && (
                        <button
                            className="btn btn-ghost"
                            disabled
                            style={{ padding: '10px 24px', cursor: 'not-allowed', opacity: 0.8 }}
                        >
                            Admin không thể mượn sách
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;