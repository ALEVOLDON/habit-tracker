import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('authToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials) => {
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
