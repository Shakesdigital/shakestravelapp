import React from 'react';

interface Version {
  id: string;
  date: Date;
  author: string;
  status: 'draft' | 'published' | 'scheduled';
  summary: string;
}

const mockVersions: Version[] = [
  {
    id: 'v1',
    date: new Date(Date.now() - 86400000),
    author: 'Admin',
    status: 'published',
    summary: 'Initial published version.'
  },
  {
    id: 'v2',
    date: new Date(Date.now() - 43200000),
    author: 'Editor',
    status: 'draft',
    summary: 'Added new images and updated intro.'
  }
];

const VersionHistory: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">🕒 Version History</h3>
      <ul className="space-y-4">
        {mockVersions.map(version => (
          <li key={version.id} className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-gray-800 dark:text-white">{version.status.charAt(0).toUpperCase() + version.status.slice(1)}</span>
              <span className="mx-2 text-gray-500 dark:text-gray-400">{version.date.toLocaleString()}</span>
              <span className="mx-2 text-gray-500 dark:text-gray-400">by {version.author}</span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{version.summary}</span>
            </div>
            <button className="px-3 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200">Restore</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default VersionHistory;
