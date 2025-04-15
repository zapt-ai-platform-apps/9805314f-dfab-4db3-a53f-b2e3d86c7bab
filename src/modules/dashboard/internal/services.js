import { eventBus } from '../../core/events';
import { events } from '../events';

/**
 * Loads dashboard content
 * In a real app, this might fetch data from an API
 */
export const loadDashboardContent = () => {
  try {
    console.log('Loading dashboard content...');
    
    // Simulate data loading
    const dashboardData = {
      title: 'Welcome to CLOUDMARSH',
      content: 'Your cloud infrastructure management application'
    };
    
    // Publish event for other modules
    eventBus.publish(events.DASHBOARD_LOADED, dashboardData);
    
    return dashboardData;
  } catch (error) {
    console.error('Failed to load dashboard content:', error);
    eventBus.publish(events.DASHBOARD_ERROR, { error: error.message });
    throw error;
  }
};