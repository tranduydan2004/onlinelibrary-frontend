export interface IBook {
    id: number;
    title: string;
    author: string;
    genre: string;
    quantity: number;
    status: string;
    coverImageUrl?: string | null;
}

export interface IGenre {
    name: string;
    bookCount: number;
}

export interface ILoanRequest {
    id: number;
    bookTitle: string;
    requestDate: string;
    dueDate: string | null;
    status: 'Đang chờ duyệt' | 'Đang mượn' | 'Đã trả' | 'Bị từ chối' | 'Quá hạn';
    canExtend: boolean;
}

export interface IUser {
    id: string;
    username: string;
    role: 'User' | 'Admin';
    email?: string | null;
    phoneNumber?: string | null;
}

// Kiểu dữ liệu đầy đủ cho trang Admin
export interface IAdminUser {
    id: number;
    username: string;
    role: string;
    isLocked: boolean;
    email?: string | null;
    phoneNumber?: string | null;
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

export interface IUserProfile {
    id: number;
    username: string;
    role: 'User' | 'Admin';
    email: string | null;
    phoneNumber: string | null;
    emailConfirmed: boolean;
}