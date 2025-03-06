
import { SubscriberCallback, PlanEventSystem } from './types';

// Create a simple event system to notify subscribers when plans change
export const createEventSystem = (): PlanEventSystem => {
  const subscribers: SubscriberCallback[] = [];
  
  // Function to notify all subscribers when plans change
  const notifySubscribers = () => {
    console.log(`[PlanEvents] Notifying ${subscribers.length} subscribers about plan changes`);
    subscribers.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error("[PlanEvents] Error in subscriber callback:", error);
      }
    });
  };
  
  // Subscribe to plan changes
  const subscribeToChanges = (callback: SubscriberCallback): (() => void) => {
    console.log("[PlanEvents] New subscription to plan changes");
    subscribers.push(callback);
    
    // Force an immediate callback to ensure initial data is loaded
    setTimeout(() => {
      try {
        console.log("[PlanEvents] Triggering initial callback for new subscriber");
        callback();
      } catch (error) {
        console.error("[PlanEvents] Error in initial subscriber callback:", error);
      }
    }, 0);
    
    // Return unsubscribe function
    return () => {
      console.log("[PlanEvents] Unsubscribing from plan changes");
      const index = subscribers.indexOf(callback);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  };
  
  return {
    subscribe: subscribeToChanges,
    notify: notifySubscribers
  };
};
