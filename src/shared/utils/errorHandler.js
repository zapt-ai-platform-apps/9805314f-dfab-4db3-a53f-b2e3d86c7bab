import * as Sentry from '@sentry/browser';

/**
 * Centralized error handler for the application
 * @param {Error} error - The error to handle
 * @param {Object} context - Additional context for the error
 */
export const handleError = (error, context = {}) => {
  console.error('Error:', error.message, context);
  
  // Add context to Sentry report
  Sentry.captureException(error, {
    extra: context
  });
  
  // Return a user-friendly error message
  return {
    message: 'Something went wrong. Please try again later.',
    originalError: error,
    context
  };
};