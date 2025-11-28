import api from './api';
import { IAdminLoan, IAdminUser, IBook, IPagedResponse } from '../types';
import { Form } from 'react-router-dom';

// --- QUẢN LÝ YÊU CẦU MƯỢN/TRẢ ---
export const getAllLoans = (pageNumber = 1, pageSize = 10) => {
    return api.get<IPagedResponse<IAdminLoan>>('/admin/loan/all', {
        params: { pageNumber, pageSize },
    });
}

export const approveLoan = (loanId: number) => {
    return api.put(`/admin/loan/${loanId}/approve`);
}

export const rejectLoan = (loanId: number) => {
    return api.put(`/admin/loan/${loanId}/reject`);
}

export const confirmReturn = (loanId: number) => {
    return api.put(`/admin/loan/${loanId}/return`);
}

// --- QUẢN LÝ NGƯỜI DÙNG ---
export const getAllUsers = (pageNumber = 1, pageSize = 10) => {
    return api.get<IPagedResponse<IAdminUser>>('/admin/user/all', {
        params: { pageNumber, pageSize },
    });
}

export const toggleUserLock = (userId: number) => {
    return api.put(`/admin/user/${userId}/toggle-lock`);
}

// --- QUẢN LÝ SÁCH ---
export const adminGetAllBooks = (pageNumber = 1, pageSize = 10) => {
    return api.get<IPagedResponse<IBook>>('/admin/book/all', {
        params: { pageNumber, pageSize },
    });
}

export const addBook = (data: { title: string; author: string; genre: string; initialQuantity: number; coverImageUrl?: string }) => {

    //1. Tạo object "payload" mới với key viết hoa (PascalCase) để phù hợp với backend
    const payload = {
        Title: data.title,
        Author: data.author,
        Genre: data.genre,
        InitialQuantity: data.initialQuantity,
        CoverImageUrl: data.coverImageUrl ?? null,
    }

    //2. Gửi object "payload" đã được "dịch" sang backend
    return api.post('/admin/book', payload);
}

export const updateBook = (bookId: number, data: Partial<{ title: string; author: string; genre: string; quantity: number; coverImageUrl?: string }>) => {

    // Tương tự như bên addBook, tạo object "payload" với key viết hoa và gửi sang backend
    const payload = {
        Title: data.title,
        Author: data.author,
        Genre: data.genre,
        Quantity: data.quantity,
        CoverImageUrl: data.coverImageUrl ?? null,
    }

    return api.put(`/admin/book/${bookId}`, payload);
}

export const deleteBook = (bookId: number) => {
    return api.delete(`/admin/book/${bookId}`);
}

export const uploadBookCover = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/upload/book-cover', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};