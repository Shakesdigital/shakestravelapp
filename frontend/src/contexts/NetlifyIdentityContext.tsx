'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  app_metadata: {
    provider?: string;
    roles?: string[];
  };
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
}

interface NetlifyIdentityContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const NetlifyIdentityContext = createContext<NetlifyIdentityContextType | undefined>(undefined);

export const NetlifyIdentityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Netlify Identity
    netlifyIdentity.init({
      logo: false, // Don't show Netlify branding
      APIUrl: 'https://main--shakestravel.netlify.app/.netlify/identity',
    });

    // Check if user is already logged in
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      setUser(currentUser as User);
    }
    setLoading(false);

    // Set up event listeners
    const handleLogin = (user: any) => {
      setUser(user);
      netlifyIdentity.close();
    };

    const handleLogout = () => {
      setUser(null);
    };

    const handleSignup = (user: any) => {
      setUser(user);
      netlifyIdentity.close();
    };

    const handleError = (err: any) => {
      console.error('Netlify Identity error:', err);
    };

    const handleInit = (user: any) => {
      if (user) {
        setUser(user);
      }
    };

    // Add event listeners
    netlifyIdentity.on('init', handleInit);
    netlifyIdentity.on('login', handleLogin);
    netlifyIdentity.on('signup', handleSignup);
    netlifyIdentity.on('logout', handleLogout);
    netlifyIdentity.on('error', handleError);

    // Cleanup
    return () => {
      netlifyIdentity.off('init', handleInit);
      netlifyIdentity.off('login', handleLogin);
      netlifyIdentity.off('signup', handleSignup);
      netlifyIdentity.off('logout', handleLogout);
      netlifyIdentity.off('error', handleError);
    };
  }, []);

  const login = () => {
    netlifyIdentity.open('login');
  };

  const signup = () => {
    netlifyIdentity.open('signup');
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  const isLoggedIn = !!user;

  return (
    <NetlifyIdentityContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </NetlifyIdentityContext.Provider>
  );
};

export const useNetlifyIdentity = () => {
  const context = useContext(NetlifyIdentityContext);
  if (context === undefined) {
    throw new Error('useNetlifyIdentity must be used within a NetlifyIdentityProvider');
  }
  return context;
};