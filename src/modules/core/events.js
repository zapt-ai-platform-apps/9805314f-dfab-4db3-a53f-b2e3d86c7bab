/**
 * EventBus for cross-module communication
 * Allows modules to communicate without direct dependencies
 */
export class EventBus {
  subscribers = {};

  subscribe(event, callback) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(callback);
    
    // Return unsubscribe function
    return () => this.unsubscribe(event, callback);
  }

  publish(event, data) {
    if (!this.subscribers[event]) return;
    
    console.log(`Event published: ${event}`, data);
    this.subscribers[event].forEach(callback => callback(data));
  }

  unsubscribe(event, callback) {
    if (!this.subscribers[event]) return;
    
    this.subscribers[event] = this.subscribers[event]
      .filter(cb => cb !== callback);
  }
}

// Singleton instance of EventBus to be used throughout the application
export const eventBus = new EventBus();