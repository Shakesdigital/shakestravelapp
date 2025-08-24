'use client';

import React, { useState } from 'react';

const MaintenanceTools: React.FC = () => {
  const [running, setRunning] = useState('');

  const run = (task: string) => {
    setRunning(task);
    setTimeout(() => setRunning(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow"> 
          <h4 className="font-semibold">Database Optimization</h4>
          <p className="text-sm text-gray-500">Run DB compact, reindex, and analyze queries.</p>
          <button onClick={() => run('db-opt')} className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">Run</button>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">Cache Management</h4>
          <p className="text-sm text-gray-500">Clear application cache and CDN cache keys.</p>
          <button onClick={() => run('cache-clear')} className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">Clear Cache</button>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">File Cleanup</h4>
          <p className="text-sm text-gray-500">Remove unused uploads and temp files.</p>
          <button onClick={() => run('cleanup')} className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">Clean</button>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">System Backup</h4>
          <p className="text-sm text-gray-500">Create a new backup of database and media files.</p>
          <button onClick={() => run('backup')} className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">Backup</button>
        </div>
      </div>

      {running && <div className="p-3 bg-yellow-50 border rounded">Running: {running}...</div>}
    </div>
  );
};

export default MaintenanceTools;
