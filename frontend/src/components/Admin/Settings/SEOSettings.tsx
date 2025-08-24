'use client';

import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

const SEOSettings: React.FC = () => {
  const { state, setState } = useSettings();
  const [local, setLocal] = useState(state.seo || { defaultTitle: '', defaultDescription: '', googleAnalytics: '', sitemapUrl: '' });

  const save = () => {
    setState({ ...state, seo: local });
    alert('SEO settings saved (localStorage).');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Default Meta Title</label>
        <input value={local.defaultTitle} onChange={e => setLocal({ ...local, defaultTitle: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm font-medium">Default Meta Description</label>
        <textarea value={local.defaultDescription} onChange={e => setLocal({ ...local, defaultDescription: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium">Google Analytics / Tracking Code</label>
        <input value={local.googleAnalytics} onChange={e => setLocal({ ...local, googleAnalytics: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        <button onClick={() => setLocal(state.seo || {})} className="px-4 py-2 border rounded">Reset</button>
      </div>
    </div>
  );
};

export default SEOSettings;
