# Online Library - Frontend React App

Đây là giao diện người dùng (Frontend) cho dự án Hệ thống Quản lý Thư viện Trực tuyến. Dự án được xây dựng với mục tiêu mang lại trải nghiệm người dùng (UX) mượt mà, giao diện (UI) hiện đại và dễ dàng tương tác cho cả độc giả lẫn quản trị viên.

## Giới thiệu

Ứng dụng này giao tiếp trực tiếp với hệ thống Backend thông qua RESTful APIs, cung cấp một nền tảng liền mạch để tìm kiếm sách, quản lý việc mượn/trả và xử lý các tác vụ quản trị.

## Công nghệ sử dụng

Dự án sử dụng các công nghệ hiện đại để đảm bảo hiệu suất và khả năng mở rộng:

- **Core:** [ReactJS](https://reactjs.org/)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/) - Đảm bảo type-safety, giúp giảm thiểu lỗi và dễ bảo trì code.
- **Styling:** CSS3 / HTML5
- **Tooling:** Create React App & npm

## Hướng dẫn cài đặt & Chạy dự án

Để chạy dự án trên môi trường local, bạn hãy làm theo các bước sau:

### Yêu cầu hệ thống
- Đã cài đặt [Node.js](https://nodejs.org/) (khuyến nghị phiên bản LTS)
- Đã cài đặt `npm` 

### Các bước cài đặt

1. **Clone repository về máy:**
   ```bash
   git clone [https://github.com/tranduydan2004/onlinelibrary-frontend.git](https://github.com/tranduydan2004/onlinelibrary-frontend.git)
   cd onlinelibrary-frontend

2. **Cài đặt các dependencies:**
   ```bash
   npm install

3. **Cấu hình biến môi trường (Nếu cần thay đổi):**
- Tạo file .env ở thư mục gốc và cấu hình URL trỏ đến Backend API của bạn (ví dụ: REACT_APP_API_URL=http://localhost:5000/api).

4. **Khởi chạy ứng dụng:**
   ```bash
   npm start

Ứng dụng sẽ tự động khởi chạy và mở tại địa chỉ http://localhost:3000. Mọi thay đổi trong code sẽ được tự động cập nhật (hot-reload) trên trình duyệt.

### Build cho môi trường Production

Khi bạn đã sẵn sàng triển khai (deploy) lên server, hãy chạy lệnh sau để tối ưu hóa ứng dụng:
   ```bash
   npm run build

Lệnh này sẽ đóng gói ứng dụng React vào thư mục build, thu nhỏ code và tối ưu hóa hiệu suất tốt nhất.

#### Cấu trúc thư mục tham khảo

   ```bash
   onlinelibrary-frontend/
   ├── public/               # Chứa các file tĩnh (index.html, favicon,...)
   ├── src/                  # Chứa toàn bộ mã nguồn React và TypeScript
   │   ├── components/       # Các UI components dùng chung (Buttons, Modals,...)
   │   ├── pages/            # Các trang giao diện chính (Home, Login, Dashboard,...)
   │   ├── services/         # Nơi gọi API kết nối tới Backend
   │   ├── utils/            # Các hàm tiện ích (format ngày tháng, validation,...)
   │   ├── App.tsx           # Component gốc của ứng dụng
   │   └── index.tsx         # Entry point kết nối React với DOM
   ├── package.json          # Quản lý thư viện và scripts
   └── tsconfig.json         # Cấu hình TypeScript

##### Các tính năng nổi bật

- **Trải nghiệm mượt mà:** Xây dựng dưới dạng SPA (Single Page Application) giúp chuyển trang không bị giật lag.
- **Tìm kiếm và Lọc Sách:** Trải nghiệm tìm kiếm nhanh chóng, lọc theo danh mục, tác giả.
- **Quản lý Tài khoản cá nhân:** Đăng nhập, đăng ký và theo dõi lịch sử mượn/trả sách.
- **Dashboard Quản trị viên:** Quản lý danh mục sách, duyệt yêu cầu và quản lý người dùng.
