import React, { useEffect } from 'react';
import { AppProviders } from './AppProviders';
import { AppRoutes } from './routes';
import { initializeModules } from '@/modules';

/**
 * Main application component
 */
export const App = () => {
  useEffect(() => {
    // Initialize all modules when the app starts
    initializeModules().catch(error => {
      console.error('Failed to initialize modules:', error);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AppProviders>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="py-6 border-b border-gray-200">
            <div className="flex items-center">
              <img 
                src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=48&height=48" 
                alt="CLOUDMARSH Logo" 
                className="w-12 h-12 mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold">CLOUDMARSH</h1>
                <p className="text-gray-600">Cloud infrastructure management application</p>
              </div>
            </div>
          </header>
          
          <main className="py-8">
            <AppRoutes />
          </main>
          
          <footer className="py-6 mt-8 text-center text-gray-500 text-sm border-t border-gray-200">
            <a 
              href="https://www.zapt.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              Made on ZAPT
            </a>
          </footer>
        </div>
      </AppProviders>
    </div>
  );
};