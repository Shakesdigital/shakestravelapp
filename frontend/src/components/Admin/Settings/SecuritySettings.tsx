'use client';

import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

const SecuritySettings: React.FC = () => {
  const { state, setState } = useSettings();
  const [local, setLocal] = useState(state.security || { apiKeys: [], permissions: [] });

  const addApiKey = () => {
    const key = `key_${Math.random().toString(36).slice(2,10)}`;
    setLocal({ ...local, apiKeys: [...(local.apiKeys||[]), { key, created: new Date().toISOString() }] });
  };

  const save = () => {
    setState({ ...state, security: local });
    alert('Security settings saved (localStorage).');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">API Keys</label>
        <div className="mt-2 space-y-2">
          {(local.apiKeys||[]).map((k:any) => (
            <div key={k.key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div className="text-sm font-mono">{k.key}</div>
              <div className="text-xs text-gray-500">{new Date(k.created).toLocaleString()}</div>
            </div>
          ))}
          <button onClick={addApiKey} className="mt-2 px-3 py-1 bg-blue-100 rounded">Create API Key</button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        <button onClick={() => setLocal(state.security || {})} className="px-4 py-2 border rounded">Reset</button>
      </div>
    </div>
  );
};

export default SecuritySettings;
