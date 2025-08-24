'use client';

import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

const EmailSettings: React.FC = () => {
  const { state, setState } = useSettings();
  const [local, setLocal] = useState(state.email || {
    smtpHost: '', smtpPort: 587, smtpUser: '', smtpPass: '', fromEmail: state.general.contactEmail
  });

  const save = () => {
    setState({ ...state, email: local });
    alert('Email settings saved (localStorage).');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">SMTP Host</label>
        <input value={local.smtpHost} onChange={e => setLocal({ ...local, smtpHost: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Port</label>
          <input type="number" value={local.smtpPort} onChange={e => setLocal({ ...local, smtpPort: Number(e.target.value) })} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">From Email</label>
          <input value={local.fromEmail} onChange={e => setLocal({ ...local, fromEmail: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">SMTP User</label>
          <input value={local.smtpUser} onChange={e => setLocal({ ...local, smtpUser: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">SMTP Password</label>
          <input type="password" value={local.smtpPass} onChange={e => setLocal({ ...local, smtpPass: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        <button onClick={() => setLocal(state.email || {})} className="px-4 py-2 border rounded">Reset</button>
      </div>
    </div>
  );
};

export default EmailSettings;
