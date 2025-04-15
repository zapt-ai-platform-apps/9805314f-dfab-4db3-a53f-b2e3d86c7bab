import React from 'react';

/**
 * Application providers component
 * Wraps the app with necessary context providers
 */
export const AppProviders = ({ children }) => {
  // In a more complex app, we would add context providers here
  // For example: ThemeProvider, AuthProvider, etc.
  return <>{children}</>;
};