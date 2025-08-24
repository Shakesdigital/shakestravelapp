import React from 'react';

const BulkActions: React.FC<{ selectedCount: number }> = ({ selectedCount }) => {
  return (
    <div className="flex items-center space-x-4 py-4">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {selectedCount} selected
      </span>
      <button className="px-3 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200">Publish</button>
      <button className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-200">Archive</button>
      <button className="px-3 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200">Delete</button>
      <button className="px-3 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200">Export</button>
      <button className="px-3 py-1 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200">Move</button>
    </div>
  );
};

export default BulkActions;
