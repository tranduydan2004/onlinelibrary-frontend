import React, { useState, useEffect } from 'react';
import { searchBooks } from '../services/bookService';
import { IBook } from '../types';
import { requestLoan } from '../services/loanService';

const HomePage: React.FC = () => {
    const [books, setBooks] = useState<IBook[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await searchBooks(searchTerm, page, pageSize);
                setBooks(response.data.items);
                setTotalPages(response.data.totalPages);
            } catch (error) { console.error("Lỗi khi tìm sách: ", error); }
        };
        // Debounce search: Chờ 300ms sau khi ngừng gõ mới gọi API
        const timerId = setTimeout(() => { fetchBooks(); }, 300);
        return () => clearTimeout(timerId);
    }, [searchTerm, page]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset về trang 1 khi tìm kiếm mới
    }

    const handleBorrow = async (bookId: number) => {
        setMessage('');
        try {
            await requestLoan(bookId);
            setMessage('Yêu cầu mượn sách đã được gửi thành công!');
        } catch (error: any) {
            setMessage(`Lỗi: ${error.response?.data?.error || 'Không thể mượn sách'}`);
        }
    };

    return (
        <div>
            <h1>Tìm kiếm sách</h1>
            <input
                type="text"
                placeholder="Nhập tên sách, tác giả ..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ width: '300px', padding: '8px' }}
            />
            {message && <p>{message}</p>}
            <div style={{ marginTop: '20px'}}>
                {books.map((book) => (
                    <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <h3>{book.title}</h3>
                        <p>Tác giả: {book.author}</p>
                        <p>Thể loại: {book.genre}</p>
                        <p>Số lượng còn: {book.quantity}</p>
                        <p>
                            {book.coverImageUrl ? <img src={book.coverImageUrl} alt={book.title} style={{ width: '50px', height: '75px', objectFit: 'cover' }} /> : 'Chưa có ảnh'}
                        </p>
                        <button 
                          onClick={() => handleBorrow(book.id)}
                          disabled={book.quantity === 0}>
                            Mượn sách
                        </button>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 &&(
                <div style={{ marginTop: '10px' }}>
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                        Trang trước
                    </button>

                    <span style={{ margin: '0 8px' }}>
                        Trang {page}/{totalPages}
                    </span>

                    <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;