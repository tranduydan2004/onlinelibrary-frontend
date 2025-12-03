import React, { useState } from 'react';
import { resetPassword } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!username || !otpCode || !newPassword || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        try {
            await resetPassword(username, otpCode, newPassword);
            setMessage("Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Đặt lại mật khẩu</h2>
                <p className="auth-subtitle">
                    Nhập tên đăng nhập, mã OTP và mật khẩu mới để tiếp tục.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
                    <div>
                    <label>Tên đăng nhập</label>
                    <input
                        className="input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </div>

                    <div>
                    <label>Mã OTP</label>
                    <input
                        className="input"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                    />
                    </div>

                    <div>
                    <label>Mật khẩu mới</label>
                    <input
                        className="input"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    </div>

                    <div>
                    <label>Nhập lại mật khẩu mới</label>
                    <input
                        className="input"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
                    {message && <p style={{ color: 'green', fontSize: '0.85rem' }}>{message}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Xác nhận
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;