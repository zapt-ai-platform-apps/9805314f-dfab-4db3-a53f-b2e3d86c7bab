import React, { useEffect, useState } from 'react';
import { api } from '../api';
import * as Sentry from '@sentry/browser';

/**
 * Dashboard component
 * Presents the main content of the application
 */
export const Dashboard = () => {
  const [data, setData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const dashboardData = api.getDashboardContent();
        setData(dashboardData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard content:', error);
        Sentry.captureException(error);
        setError(error.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <p className="text-gray-700">{data.content}</p>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h2 className="text-lg font-semibold mb-2">Cloud Infrastructure Management</h2>
        <p className="text-gray-700 mb-4">
          Manage your cloud resources efficiently with CLOUDMARSH. Monitor performance, 
          optimize costs, and ensure security across your infrastructure.
        </p>
      </div>
    </div>
  );
};