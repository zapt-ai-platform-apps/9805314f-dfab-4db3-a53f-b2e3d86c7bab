import { validateDashboardContent } from './validators';
import { loadDashboardContent } from './internal/services';

/**
 * Dashboard module's public API
 * This is the only way other modules should interact with the dashboard module
 */
export const api = {
  /**
   * Gets dashboard content with validation
   */
  getDashboardContent() {
    const data = loadDashboardContent();
    
    // Validate before exposing outside the module
    return validateDashboardContent(data, {
      actionName: 'getDashboardContent',
      location: 'dashboard/api.js',
      direction: 'outgoing',
      moduleFrom: 'dashboard',
      moduleTo: 'client'
    });
  }
};