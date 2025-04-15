import React from 'react';

/**
 * "Made on ZAPT" badge component
 */
export const ZaptBadge = () => {
  return (
    <a 
      href="https://www.zapt.ai" 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition-colors"
    >
      Made on ZAPT
    </a>
  );
};