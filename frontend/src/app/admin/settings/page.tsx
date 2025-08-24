'use client';

import React, { useState } from 'react';
import { SettingsProvider } from '@/components/Admin/Settings/SettingsContext';
import GeneralSettings from '@/components/Admin/Settings/GeneralSettings';
import EmailSettings from '@/components/Admin/Settings/EmailSettings';
import PaymentSettings from '@/components/Admin/Settings/PaymentSettings';
import SEOSettings from '@/components/Admin/Settings/SEOSettings';
import SecuritySettings from '@/components/Admin/Settings/SecuritySettings';
import MaintenanceTools from '@/components/Admin/Settings/MaintenanceTools';

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'email', label: 'Email' },
  { id: 'payment', label: 'Payments' },
  { id: 'seo', label: 'SEO' },
  { id: 'security', label: 'Security' },
  { id: 'maintenance', label: 'Maintenance' }
];

export default function AdminSettingsPage() {
  const [active, setActive] = useState('general');

  return (
    <SettingsProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-gray-500">Manage site-wide configuration and operational settings.</p>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4">
          <nav className="flex space-x-4 border-b pb-4 mb-4">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`py-2 px-3 rounded-md ${active === t.id ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div>
            {active === 'general' && <GeneralSettings />}
            {active === 'email' && <EmailSettings />}
            {active === 'payment' && <PaymentSettings />}
            {active === 'seo' && <SEOSettings />}
            {active === 'security' && <SecuritySettings />}
            {active === 'maintenance' && <MaintenanceTools />}
          </div>
        </div>
      </div>
    </SettingsProvider>
  );
}
