import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/authService';

const VerifyEmailPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const defaultUsername = (location.state as any)?.username ?? '';

    const [username, setUsername] = useState(defaultUsername);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Xóa các thông báo cũ
        setError('');
        setSuccess('');

        if (!username || !otp) {
            setError("Vui lòng nhập tên đăng nhập và mã OTP.");
            return;
        }

        try {
            await verifyEmail(username, otp);
            setSuccess("Xác thực email thành công! Bạn có thể đăng nhập.");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("Không thể xác thực. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Xác thực email</h2>
                <p className="auth-subtitle">
                  Nhập tên đăng nhập và mã OTP được gửi tới hộp thư của bạn.
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
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
                    {success && <p style={{ color: 'green', fontSize: '0.85rem' }}>{success}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Xác thực
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmailPage;