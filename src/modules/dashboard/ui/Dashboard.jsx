import React, { useState } from 'react';
import FileBrowser from './FileBrowser';
import * as Sentry from '@sentry/browser';

/**
 * Dashboard component
 * Presents the main content of the application
 */
export const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 border border-red-200 rounded bg-red-50">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Files and Folders</h1>
        <p className="text-gray-600">Manage your cloud files and folders with CLOUDMARSH</p>
      </div>
      
      <FileBrowser />
    </div>
  );
};