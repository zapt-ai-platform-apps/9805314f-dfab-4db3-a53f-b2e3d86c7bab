import React from 'react';
import { Home } from './pages/Home';

/**
 * Application routes configuration
 * Simple implementation as we're not using a router yet
 */
export const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  }
];

/**
 * Application routes component
 */
export const AppRoutes = () => {
  // Since we're not using a router yet, just render the Home component
  return <Home />;
};