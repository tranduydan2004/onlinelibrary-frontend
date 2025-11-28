import api from './api';
import { IBook, IPagedResponse } from '../types';

// Tìm sách theo từ khóa
export const searchBooks = (keyword: string, pageNumber = 1, pageSize = 10) => {
    return api.get<IPagedResponse<IBook>>('/book/search', {
        params: { keyword, pageNumber, pageSize },
    });
};

// Lấy thông tin chi tiết sách theo ID
export const getBookById = (id: number) => {
    return api.get<IBook>(`/book/${id}`);
};