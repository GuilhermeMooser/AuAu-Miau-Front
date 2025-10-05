import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginRequest, AuthResponse } from '@/types';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock user - authentication disabled for development
  const [user] = useState<User>({
    id: '1',
    username: 'admin',
    email: 'admin@demo.com',
    role: 'admin',
    createdAt: new Date(),
  });
  const [isLoading] = useState(false);
  const { toast } = useToast();

  const login = async (credentials: LoginRequest) => {
    // Login disabled for development
    toast({
      title: "Autenticação desativada",
      description: "Modo de desenvolvimento - login desativado",
    });
  };

  const logout = () => {
    toast({
      title: "Autenticação desativada",
      description: "Modo de desenvolvimento - logout desativado",
    });
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};