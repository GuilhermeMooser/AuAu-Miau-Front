import { api } from './api';
import { LoginRequest, AuthResponse, User } from '@/types';

export const authService = {
  // Login do usuário
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Validar token atual
  validateToken: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout do usuário
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  // Alterar senha
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};