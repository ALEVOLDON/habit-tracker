import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api, AuthResponse } from '../services/api';

interface AuthContextType {
  token: string | null;
  login: (credentials: { email: string, password: string }) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    // Синхронизация состояния с localStorage при изменениях в других вкладках
    const handleStorageChange = () => {
      setToken(localStorage.getItem('authToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials: { email: string, password: string }) => {
    const response = await api.login(credentials);
    localStorage.setItem('authToken', response.token);
    setToken(response.token);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  const value = { token, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};