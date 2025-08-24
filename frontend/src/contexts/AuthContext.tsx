'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance, { setAuthToken, removeAuthToken, getAuthToken, api } from '@/lib/axios';
import { showToast } from '@/lib/toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'host' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getAuthToken();
    if (savedToken) {
      try {
        const decoded = jwtDecode<{exp: number; id: string; email: string; name: string; role: 'user' | 'host' | 'admin'}>(savedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
          });
        } else {
          removeAuthToken();
        }
      } catch {
        removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      setAuthToken(newToken);
      showToast.success(`Welcome back, ${userData.name}!`);
    } catch (error: any) {
      // Error handled by axios interceptor, just re-throw
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'user') => {
    try {
      const response = await api.auth.register({ name, email, password, role });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      setAuthToken(newToken);
  showToast.success(`Welcome to Shakes Travel, ${userData.name}!`);
    } catch (error: any) {
      // Error handled by axios interceptor, just re-throw
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeAuthToken();
    showToast.info('You have been logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      loading
    }}>
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