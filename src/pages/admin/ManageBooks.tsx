// src/pages/admin/ManageBooks.tsx
import React, { useState, useEffect } from 'react';
import { adminGetAllBooks, addBook, deleteBook, uploadBookCover, updateBook } from '../../services/adminService';
import { IBook } from '../../types';

const ManageBooks = () => {
    const [books, setBooks] = useState<IBook[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    
    // State cho form thêm sách mới
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [quantity, setQuantity] = useState<string>('1');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState<string>('');
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const [editingBook, setEditingBook] = useState<IBook | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editAuthor, setEditAuthor] = useState('');
    const [editGenre, setEditGenre] = useState('');
    const [editQuantity, setEditQuantity] = useState<string>('1');
    const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
    const [editCoverImageUrl, setEditCoverImageUrl] = useState<string>('');

    const fetchBooks = async (pageNumber = 1) => {
        try {
            const res = await adminGetAllBooks(pageNumber, pageSize);
            setBooks(res.data.items);
            setPage(res.data.pageNumber);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi tải danh sách sách:", error);
        }
    };

    const startEditBook = (book: IBook) => {
        setEditingBook(book);
        setEditTitle(book.title);
        setEditAuthor(book.author);
        setEditGenre(book.genre);
        setEditQuantity(book.quantity.toString());
        setEditCoverImageUrl(book.coverImageUrl ?? '');
        setEditCoverFile(null);
        setError('');
        setSuccess('');
    };

    useEffect(() => { fetchBooks(1); }, []);

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
            setError('Số lượng phải là số nguyên >= 1');
            return;
        }
        try {
            let coverImageUrl: string | undefined;

            //1. Nếu có chọn ảnh thì upload trước
            if (coverFile) {
                const uploadRes = await uploadBookCover(coverFile);
                coverImageUrl = uploadRes.data.url; // URL backend trả về
            }

            //2. Gọi API thêm sách với coverImageUrl vừa nhận
            await addBook({ title, author, genre, initialQuantity: parsedQuantity, coverImageUrl });
            setSuccess('Thêm sách thành công!');
            // Xóa form
            setTitle('');
            setAuthor('');
            setGenre('');
            setQuantity('1');
            setCoverFile(null);
            // Tải lại danh sách
            fetchBooks();
        } catch (error) {
            console.error("Lỗi khi thêm sách:", error);
            setError('Thêm sách thất bại. Vui lòng thử lại.');
        }
    };

    const handleDelete = async (bookId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác.')) {
            try {
                await deleteBook(bookId);
                fetchBooks(); // Tải lại danh sách
            } catch (error) {
                console.error("Lỗi khi xóa sách:", error);
                alert('Xóa sách thất bại. Sách có thể đang được mượn.');
            }
        }
    };

    const handleUpdateBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBook) return;

        setError('');
        setSuccess('');

        const parsedQuantity = parseInt(editQuantity, 10);
        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
            setError('Số lượng tồn kho phải là số nguyên >= 0');
            return;
        }
        
        try {
            let newCoverUrl: string | undefined;

            // Nếu chọn file ảnh mới thì upload trước
            if (editCoverFile) {
                const uploadRes = await uploadBookCover(editCoverFile);
                newCoverUrl = uploadRes.data.url;
            }

            await updateBook(editingBook.id, {
                title: editTitle,
                author: editAuthor,
                genre: editGenre,
                quantity: parsedQuantity,
                coverImageUrl: newCoverUrl ?? editCoverImageUrl,
            });

            setSuccess('Cập nhật sách thành công!');
            setEditingBook(null);
            setEditTitle('');
            setEditAuthor('');
            setEditGenre('');
            setEditQuantity('1');
            setEditCoverImageUrl('');
            setEditCoverFile(null);
            fetchBooks(); // Tải lại danh sách
        } catch (err) {
            console.error("Lỗi khi cập nhật sách:", err);
            setError('Cập nhật sách thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            {/* Form thêm sách mới */}
            <div>
                <h3>Thêm sách mới</h3>
                <form onSubmit={handleAddBook}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Tên sách: </label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Tác giả: </label>
                        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Thể loại: </label>
                        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Số lượng: </label>
                        <input type="number" value={quantity} min={1} onChange={(e) => setQuantity(e.target.value)} required />
                    </div>
                    <div>
                        <label>URL Ảnh Bìa (tùy chọn): </label>
                        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
                    </div>
                    <button type="submit">Thêm sách</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                </form>

                {/* Form chỉnh sửa sách */}
                {editingBook && (
                    <div style={{ marginTop: '20px' }}>
                        <h3>Chỉnh sửa sách (ID: {editingBook.id})</h3>
                        <form onSubmit={handleUpdateBook}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Tên sách: </label>
                            <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            required
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Tác giả: </label>
                            <input
                            type="text"
                            value={editAuthor}
                            onChange={(e) => setEditAuthor(e.target.value)}
                            required
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Thể loại: </label>
                            <input
                            type="text"
                            value={editGenre}
                            onChange={(e) => setEditGenre(e.target.value)}
                            required
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Số lượng (tồn kho): </label>
                            <input
                                type="number"
                                min={0}
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Ảnh bìa hiện tại: </label>
                            {editingBook.coverImageUrl ? (
                            <img
                                src={editingBook.coverImageUrl}
                                alt={editingBook.title}
                                style={{ width: '50px', height: '75px', objectFit: 'cover', marginLeft: '8px' }}
                            />
                            ) : (
                            <span> Chưa có ảnh</span>
                            )}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Chọn ảnh bìa mới (tùy chọn): </label>
                            <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditCoverFile(e.target.files?.[0] ?? null)}
                            />
                        </div>
                        <button type="submit">Lưu thay đổi</button>
                        <button
                            type="button"
                            style={{ marginLeft: '10px' }}
                            onClick={() => setEditingBook(null)}
                        > Hủy
                        </button>
                        </form>
                    </div>
                )}
            </div>

            <hr style={{ margin: '20px 0' }} />

            {/* Danh sách sách */}
            <h3>Danh sách Sách</h3>
            <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Sách</th>
                        <th>Tác giả</th>
                        <th>Thể loại</th>
                        <th>Số lượng (Tồn)</th>
                        <th>Ảnh Bìa</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.genre}</td>
                            <td>{book.quantity}</td>
                            <td>
                                {book.coverImageUrl ? <img src={book.coverImageUrl} alt={book.title} style={{ width: '50px', height: '75px', objectFit: 'cover' }} /> : 'Chưa có ảnh'}
                            </td>
                            <td>
                                <button onClick={() => startEditBook(book)}>Sửa</button>
                                <button onClick={() => handleDelete(book.id)} style={{ color: 'red' }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div style={{ marginTop: '10px' }}>
                    <button disabled={page === 1} onClick={() => fetchBooks(page - 1)}>
                        Trang trước
                    </button>

                    <span style={{ margin: '0 8px' }}>
                        Trang {page}/{totalPages}
                    </span>

                    <button disabled={page === totalPages} onClick={() => fetchBooks(page + 1)}>
                        Trang sau
                    </button>

                </div>
            )}
        </div>
    );
};

export default ManageBooks;