import React, { useEffect, useState } from 'react';
import { GetMyProfile, updateMyProfile } from '../services/profileService';
import { IUserProfile } from '../types';

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<IUserProfile | null>(null);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await GetMyProfile();
                setProfile(res.data);
                setEmail(res.data.email ?? '');
                setPhoneNumber(res.data.phoneNumber ?? '');
            } catch {
                setError("Không thể tải thông tin cá nhân.");
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await updateMyProfile(email, phoneNumber);
            setMessage("Cập nhật thônng tin thành công. Nếu bạn đổi email, vui lòng kiểm tra hộp thư để xác thực.");
        } catch (err: any) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("Cập nhật thông tin thất bại. Vui lòng thử lại.");
            }
        }
    };

    if (!profile) {
        return <p>Đang tải...</p>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="page-title">Hồ sơ cá nhân</h2>
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', borderBottom: '1px solid var(--border-soft)', paddingBottom: '20px' }}>
                    <div className="nav-avatar" style={{ width: 60, height: 60, fontSize: '1.5rem' }}>
                        {profile.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 style={{ margin: 0 }}>{profile.username}</h3>
                        <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>Vai trò: {profile.role}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{display: 'block', marginBottom: 5, fontSize: '0.9rem'}}>Email</label>
                        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <div style={{fontSize: '0.8rem', marginTop: 4, color: profile.emailConfirmed ? 'green' : 'orange'}}>
                             {profile.emailConfirmed ? '✓ Đã xác thực' : '⚠ Chưa xác thực'}
                        </div>
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{display: 'block', marginBottom: 5, fontSize: '0.9rem'}}>Số điện thoại</label>
                        <input className="input" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {message && <p style={{ color: 'green' }}>{message}</p>}

                    <div style={{ textAlign: 'right', marginTop: 20 }}>
                        <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;