import React, { useState } from 'react';
import { forgotPassword } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!usernameOrEmail.trim()) {
            setError("Vui lòng nhập tên đăng nhập hoặc email.");
            return;
        }

        try {
            await forgotPassword(usernameOrEmail.trim());
            setMessage("Nếu tài khoản tồn tại, mã đặt lại mật khẩu đã được gửi vào email đăng ký tài khoản của bạn.");
            setTimeout(() => navigate('/reset-password'), 2000);
        } catch (err: any) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("Yêu cầu đặt lại mật khẩu thất bại. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Quên mật khẩu</h2>
                <p className="auth-subtitle">Nhập email hoặc username để lấy lại mật khẩu</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <input
                            className="input"
                            type="text"
                            placeholder="Tên đăng nhập hoặc email"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />
                    </div>
                    
                    {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '10px' }}>{error}</p>}
                    {message && <p style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '10px' }}>{message}</p>}
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Gửi yêu cầu
                    </button>
                    
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                         <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>Quay lại đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;