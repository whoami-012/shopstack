import api from './axios';
import type { UserCreate, UserLogin, UserUpdate, ChangePasswordRequest, DeleteAccountRequest, AdminUserUpdate, UserRead } from '../types';

export const userService = {
  register: (userData: UserCreate) => api.post<UserRead>('/users/register', userData),
  login: (credentials: UserLogin) => api.post<{ access_token: string, token_type: string }>('/users/login', credentials),
  getMe: () => api.get<UserRead>('/api/me'),
  updateProfile: (data: UserUpdate) => api.put<UserRead>('/users/me', data),
  changePassword: (data: ChangePasswordRequest) => api.put<{ message: string }>('/users/me/change-password', data),
  deleteAccount: (data: DeleteAccountRequest) => api.delete<{ message: string }>('/users/me', { data }),
  
  admin: {
    listUsers: (limit = 20, offset = 0) => 
      api.get<UserRead[]>(`/admin/users?limit=${limit}&offset=${offset}`),
    getUser: (id: string) => api.get<UserRead>(`/admin/users/${id}`),
    updateUser: (id: string, data: AdminUserUpdate) => api.patch<UserRead>(`/admin/users/${id}`, data),
    promoteUser: (id: string) => api.patch<UserRead>(`/admin/users/${id}/promote`),
    deactivateUser: (id: string) => api.delete<UserRead>(`/admin/users/${id}`),
  }
};
