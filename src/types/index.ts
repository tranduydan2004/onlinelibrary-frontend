export interface IBook {
    id: number;
    title: string;
    author: string;
    genre: string;
    quantity: number;
    status: string;
    coverImageUrl?: string | null;
}

export interface ILoanRequest {
    id: number;
    bookTitle: string;
    requestDate: string;
    dueDate: string | null;
    status: 'Đang chờ duyệt' | 'Đang mượn' | 'Đã trả' | 'Bị từ chối' | 'Quá hạn';
}

export interface IUser {
    id: string;
    username: string;
    role: 'User' | 'Admin';
}

// Kiểu dữ liệu đầy đủ cho trang Admin
export interface IAdminUser {
    id: number;
    username: string;
    role: string;
    isLocked: boolean;
}

export interface IAdminLoan {
    id: number;
    bookTitle: string;
    username: string;
    requestDate: string;
    dueDate: string | null;
    status: string;
}

export interface IPagedResponse<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}