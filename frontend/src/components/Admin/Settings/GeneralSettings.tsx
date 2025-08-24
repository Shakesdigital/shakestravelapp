'use client';

import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

const GeneralSettings: React.FC = () => {
  const { state, setState } = useSettings();
  const [local, setLocal] = useState(state.general);

  const save = () => {
    setState({ ...state, general: local });
    alert('General settings saved (localStorage).');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Site Name</label>
        <input value={local.siteName} onChange={e => setLocal({ ...local, siteName: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Logo URL</label>
        <input value={local.logoUrl} onChange={e => setLocal({ ...local, logoUrl: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Contact Email</label>
          <input value={local.contactEmail} onChange={e => setLocal({ ...local, contactEmail: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Primary Color</label>
          <input value={local.primaryColor} onChange={e => setLocal({ ...local, primaryColor: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Timezone</label>
          <input value={local.timezone} onChange={e => setLocal({ ...local, timezone: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        <button onClick={() => setLocal(state.general)} className="px-4 py-2 border rounded">Reset</button>
      </div>
    </div>
  );
};

export default GeneralSettings;
