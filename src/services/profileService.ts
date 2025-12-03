import api from './api';
import { IUserProfile } from '../types';

export const GetMyProfile = () => {
    return api.get<IUserProfile>('/profile/me');
};

export const updateMyProfile = (email: string, phoneNumber: string) => {
    return api.put('/profile/me', {
        Email: email,
        PhoneNumber: phoneNumber,
    });
};