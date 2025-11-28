import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Lấy hàm login từ Context

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/'); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
        } catch (err: any) {
            setError(err.response?.data?.error || 'Đăng nhập thất bại');
        }
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Tên đăng nhập:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default LoginPage;