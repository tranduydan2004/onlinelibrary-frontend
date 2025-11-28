import api from './api';
import { ILoanRequest, IPagedResponse } from '../types';

// Yêu cầu mượn sách
export const requestLoan = (bookId: number) => {
    return api.post('/loan/request', { bookId });
};

// Lịch sử mượn sách
export const getLoanHistory = (pageNumber = 1, pageSize = 10) => {
    return api.get<IPagedResponse<ILoanRequest>>('/loan/history', {
        params: { pageNumber, pageSize },
    });
};

// Gia hạn mượn sách
export const extendLoan = (loanId: number) => {
    return api.put(`/loan/extend/${loanId}`);
};