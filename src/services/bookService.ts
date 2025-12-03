import api from './api';
import { IBook, IGenre, IPagedResponse } from '../types';

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

// Lấy danh sách thể loại sách
export const getGenres = (search: string, pageNumber = 1, pageSize = 10) => {
    return api.get<IPagedResponse<IGenre>>('/book/genres', {
        params: { search, pageNumber, pageSize },
    });
};

// Lấy sách theo thể loại
export const searchBooksByGenre = (genre: string, pageNumber = 1, pageSize = 10) => {
    return api.get<IPagedResponse<IBook>>('/book/by-genre', {
        params: { genre, pageNumber, pageSize },
    });
};