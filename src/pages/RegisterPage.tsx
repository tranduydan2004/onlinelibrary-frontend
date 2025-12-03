import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        // Xóa các thông báo cũ
        setError('');
        setSuccess('');

        // --- 1. Validation phía Client ---
        if (!username || !password || !confirmPassword || !email || !phoneNumber) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Email không hợp lệ.");
            return;
        }

        // --- 2. Gọi API để đăng ký ---
        try {
            await register(username, password, email, phoneNumber);
            // Xử lý khi đăng ký thành công
            setSuccess('Đăng ký tài khoản thành công! Vui lòng kiểm tra email để nhập mã OTP xác thực.');

            // Tự động chuyển hướng đến trang xác thực email sau 2 giây
            setTimeout(() => {
                navigate('/verify-email', { state: { username } });
            }, 2000);
            
        } catch (err) {
            const error = err as any;
            // Xử lý khi có lỗi từ server (như username đã tồn tại, ...)
            if (error.response && error.response.data) {
                setError(error.response.data.error || "Đã có lỗi xảy ra. Vui lòng thử lại.");
            } else {
                setError("Không thể kết nối đến máy chủ.");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Đăng ký tài khoản</h2>
                <p className="auth-subtitle">
                    Tạo tài khoản để bắt đầu mượn và quản lý sách trực tuyến.
                </p>

                <form onSubmit={handleRegister} style={{ display: 'grid', gap: 12 }}>
                    <div>
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        className="input"
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    </div>

                    <div>
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        className="input"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>

                    <div>
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <input
                        className="input"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    </div>

                    <div>
                    <label htmlFor="email">Email</label>
                    <input
                        className="input"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>

                    <div>
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                        className="input"
                        type="tel"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
                    {success && <p style={{ color: 'green', fontSize: '0.85rem' }}>{success}</p>}

                    <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 4 }}
                    >
                    Đăng ký
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;