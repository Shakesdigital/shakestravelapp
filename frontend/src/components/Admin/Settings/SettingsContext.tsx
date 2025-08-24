'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface GeneralSettings {
  siteName: string;
  logoUrl?: string;
  contactEmail?: string;
  primaryColor?: string;
  timezone?: string;
  language?: string;
}

interface SettingsState {
  general: GeneralSettings;
  email: any;
  payment: any;
  seo: any;
  security: any;
}

const defaultState: SettingsState = {
  general: {
    siteName: 'Shakes Travel',
    logoUrl: '/logo.png',
    contactEmail: 'contact@shakestravel.com',
    primaryColor: '#195e48',
    timezone: 'Africa/Kampala',
    language: 'en'
  },
  email: {},
  payment: {},
  seo: {},
  security: {}
};

const SettingsContext = createContext<{ state: SettingsState; setState: (s: SettingsState) => void } | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SettingsState>(() => {
    try {
      const raw = localStorage.getItem('shakes_settings');
      return raw ? JSON.parse(raw) : defaultState;
    } catch (e) {
      return defaultState;
    }
  });

  useEffect(() => {
    try { localStorage.setItem('shakes_settings', JSON.stringify(state)); } catch (e) {}
  }, [state]);

  return <SettingsContext.Provider value={{ state, setState }}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};

export default SettingsContext;
