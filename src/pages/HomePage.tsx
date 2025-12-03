import React, { useEffect, useState } from 'react';
import { searchBooks } from '../services/bookService';
import { IBook } from '../types';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 8;

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadBooks = async (pageNumber: number, currentKeyword: string) => {
    try {
      setLoading(true);
      const res = await searchBooks(currentKeyword || '', pageNumber, PAGE_SIZE);

      setBooks(res.data.items);
      setPage(res.data.pageNumber);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Lỗi khi tải sách:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(1, '');
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBooks(1, keyword.trim());
  };

  const handleChangePage = (newPage: number) => {
    if (newPage === page) return;
    loadBooks(newPage, keyword.trim());
  };

  const goToBookDetail = (id: number) => {
    navigate(`/book/${id}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-main">
          <div className="hero-kicker">Thư viện số ABC · 24/7</div>
          <h1 className="hero-title">Khám phá kho sách của bạn, ở mọi nơi.</h1>
          <p className="hero-subtitle">
            Tìm kiếm, mượn và quản lý sách chỉ với vài cú click. Dành cho sinh viên
            bận rộn nhưng vẫn muốn đọc nhiều hơn mỗi ngày.
          </p>

          <form className="hero-search" onSubmit={handleSearchSubmit}>
            <input
              className="hero-search-input"
              placeholder="Tìm sách theo tên, tác giả..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary hero-search-btn">
              Tìm kiếm
            </button>
          </form>

          <div className="hero-meta">
            <span>
              <strong>+ Hàng trăm</strong> đầu sách đang có sẵn
            </span>
            <span>
              <strong>Gia hạn online</strong> chỉ với 1 cú click
            </span>
          </div>
        </div>

        <aside className="hero-side">
          <div className="hero-card">
            <div className="hero-card-title">Hoạt động hôm nay</div>
            <div className="hero-card-number">{books.length.toString().padStart(2, '0')}</div>
            <div className="hero-card-grid">
              <div>
                <div style={{ color: '#9ca3af' }}>Sách hiển thị</div>
                <div style={{ fontWeight: 600 }}>Trang {page}/{totalPages || 1}</div>
              </div>
              <div>
                <div style={{ color: '#9ca3af' }}>Chế độ sinh viên</div>
                <div style={{ fontWeight: 600 }}>Miễn phí mượn</div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* DANH SÁCH SÁCH */}
      <section className="card">
        <div className="page-title">Tất cả sách</div>
        <div className="page-subtitle">
          {keyword
            ? `Kết quả cho “${keyword}”`
            : 'Gợi ý sách nổi bật dành cho bạn'}
        </div>

        {loading ? (
          <p>Đang tải sách...</p>
        ) : books.length === 0 ? (
          <p>Không tìm thấy sách nào.</p>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <article
                key={book.id}
                className="book-card"
                onClick={() => goToBookDetail(book.id)}
                style={{ cursor: 'pointer' }}
              >
                {book.coverImageUrl && (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="book-cover"
                  />
                )}
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
                <div className="book-meta-row">
                  <span className="badge badge-soft">{book.genre}</span>
                  <span>
                    Tồn:{' '}
                    <strong>{book.quantity}</strong>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-ghost"
              disabled={page === 1}
              onClick={() => handleChangePage(page - 1)}
            >
              Trang trước
            </button>
            <span>
              Trang <strong>{page}</strong> / {totalPages}
            </span>
            <button
              className="btn btn-ghost"
              disabled={page === totalPages}
              onClick={() => handleChangePage(page + 1)}
            >
              Trang sau
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
