import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        // Xóa các thông báo cũ
        setError('');
        setSuccess('');

        // --- 1. Validation phía Client ---
        if (!username || !password || !confirmPassword) {
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

        // --- 2. Gọi API để đăng ký ---
        try {
            const response = await register(username, password);
            // Xử lý khi đăng ký thành công
            setSuccess('Đăng ký tài khoản thành công! Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây.');

            // Tự động chuyển hướng đến trang đăng nhập sau 3 giây
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
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
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Đăng ký tài khoản</h2>
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username">Tên đăng nhập:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </div>

                {/* Hiển thị thông báo lỗi hoặc thành công */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <button 
                    type="submit" 
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                Đăng ký
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;