import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminDashboardStats } from '../../services/adminService';
import { IAdminDashboardStats } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<IAdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getAdminDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error('Lỗi khi tải thống kê dashboard:', err);
        setError('Không thể tải thống kê. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="page">
      {/* Hero section */}
      <header className="page-header">
        <h1 className="page-title">Bảng điều khiển quản trị</h1>
        <p className="page-subtitle">
          Tóm tắt nhanh tình hình thư viện: sách, người dùng và các yêu cầu mượn / trả.
        </p>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && !stats && <p>Đang tải thống kê...</p>}

      {stats && (
        <>
          {/* Hàng card thống kê chính */}
          <section className="page-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Tổng số sách</div>
                <div className="stat-value">{stats.totalBooks}</div>
                <p className="stat-caption">Đầu sách hiện có trong hệ thống</p>
              </div>

              <div className="stat-card">
                <div className="stat-label">Người dùng</div>
                <div className="stat-value">{stats.totalUsers}</div>
                <p className="stat-caption">Bao gồm độc giả và quản trị viên</p>
              </div>

              <div className="stat-card">
                <div className="stat-label">Yêu cầu đang chờ duyệt</div>
                <div className="stat-value stat-value--warning">
                  {stats.pendingLoanRequests}
                </div>
                <p className="stat-caption">
                  Cần được xử lý trong trang Quản lý mượn / trả
                </p>
              </div>
            </div>
          </section>

          {/* Thống kê sách thêm mới */}
          <section className="page-section">
            <h2 className="section-title">Sách thêm mới</h2>
            <div className="stats-grid stats-grid--small">
              <div className="stat-card stat-card--muted">
                <div className="stat-label">Hôm nay</div>
                <div className="stat-value">{stats.booksAddedToday}</div>
              </div>

              <div className="stat-card stat-card--muted">
                <div className="stat-label">7 ngày qua</div>
                <div className="stat-value">{stats.booksAddedThisWeek}</div>
              </div>

              <div className="stat-card stat-card--muted">
                <div className="stat-label">Tháng này</div>
                <div className="stat-value">{stats.booksAddedThisMonth}</div>
              </div>
            </div>
          </section>

          {/* Điều hướng nhanh tới các chức năng chính */}
          <section className="page-section">
            <h2 className="section-title">Điều hướng nhanh</h2>
            <div className="quick-links">
              <Link className="quick-link-card" to="/admin/loans">
                <span className="quick-link-title">Quản lý mượn / trả</span>
                <span className="quick-link-caption">
                  Xem và xử lý các yêu cầu đang chờ
                </span>
              </Link>

              <Link className="quick-link-card" to="/admin/books">
                <span className="quick-link-title">Quản lý sách</span>
                <span className="quick-link-caption">
                  Thêm mới, chỉnh sửa và cập nhật tồn kho
                </span>
              </Link>

              <Link className="quick-link-card" to="/admin/users">
                <span className="quick-link-title">Quản lý người dùng</span>
                <span className="quick-link-caption">
                  Xem thông tin, khóa / mở khóa tài khoản
                </span>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;