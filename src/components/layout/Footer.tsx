import React from 'react';

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="main-footer">
            <div className="main-footer-inner">
                <div>
                <strong>Thư viện Online</strong> · Trường Đại học ABC
                </div>
                <div>Địa chỉ: 123 Đường XYZ, Quận 12, TP. HCM</div>
                <div>
                Điện thoại: (0123) 456-789 · Email hỗ trợ: support@abc.edu.vn
                </div>
                <div style={{ marginTop: 6 }}>
                &copy; {year} OnlineLibrary. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;