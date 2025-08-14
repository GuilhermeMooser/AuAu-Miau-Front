import { api } from './api';
import { LoginRequest, AuthResponse, User } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Mock implementation - replace with real API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          resolve({
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: '1',
              username: 'admin',
              email: 'admin@auauaomiau.org',
              role: 'admin',
              createdAt: new Date(),
            }
          });
        } else if (credentials.username === 'user' && credentials.password === 'user123') {
          resolve({
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: '2',
              username: 'user',
              email: 'user@auauaomiau.org',
              role: 'user',
              createdAt: new Date(),
            }
          });
        } else {
          reject({
            response: {
              data: { message: 'Credenciais inválidas' }
            }
          });
        }
      }, 1000);
    });
  },

  validateToken: async (): Promise<User> => {
    // Mock implementation - replace with real API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const token = localStorage.getItem('authToken');
        if (token && token.startsWith('mock-jwt-token-')) {
          resolve({
            id: '1',
            username: 'admin',
            email: 'admin@auauaomiau.org',
            role: 'admin',
            createdAt: new Date(),
          });
        } else {
          reject(new Error('Invalid token'));
        }
      }, 500);
    });
  },

  logout: async (): Promise<void> => {
    return Promise.resolve();
  },
};