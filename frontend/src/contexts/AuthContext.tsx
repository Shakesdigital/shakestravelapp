'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance, { setAuthToken, removeAuthToken, getAuthToken, api } from '@/lib/axios';
import { showToast } from '@/lib/toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  role: 'guest' | 'user' | 'host' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, agreeToTerms?: boolean, agreeToPrivacy?: boolean) => Promise<void>;
  googleLogin: (credential: string, clientId?: string) => Promise<void>;
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
        const decoded = jwtDecode<{exp: number; userId: string; email: string; role: 'guest' | 'user' | 'host' | 'admin'}>(savedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          setUser({
            id: decoded.userId,
            email: decoded.email,
            firstName: '',
            lastName: '',
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
      const { data } = response.data;

      // Handle both old format (token) and new format (tokens.accessToken)
      const newToken = data.tokens?.accessToken || data.token;
      const userData = data.user;

      setToken(newToken);
      setUser({
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`
      });
      setAuthToken(newToken);
      showToast.success(`Welcome back, ${userData.firstName}!`);
    } catch (error: any) {
      // Error handled by axios interceptor, just re-throw
      throw error;
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, agreeToTerms: boolean = true, agreeToPrivacy: boolean = true) => {
    try {
      const response = await api.auth.register({
        firstName,
        lastName,
        email,
        password,
        agreeToTerms,
        agreeToPrivacy
      });
      const { data } = response.data;

      // Handle both old format (token) and new format (tokens.accessToken)
      const newToken = data.tokens?.accessToken || data.token;
      const userData = data.user;

      setToken(newToken);
      setUser({
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`
      });
      setAuthToken(newToken);
      showToast.success(`Welcome to Shakes Travel, ${userData.firstName}!`);
    } catch (error: any) {
      // Error handled by axios interceptor, just re-throw
      throw error;
    }
  };

  const googleLogin = async (credential: string, clientId?: string) => {
    try {
      const response = await api.auth.googleLogin({ credential, clientId });
      const { data } = response.data;
      const { token: newToken, user: userData } = data;
      
      setToken(newToken);
      setUser({
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`
      });
      setAuthToken(newToken);
      showToast.success(`Welcome to Shakes Travel, ${userData.firstName}!`);
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
      googleLogin,
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