
import { SubscriptionPlan, ApiResponse } from '@/types/api';

// Type for subscriber callback functions
export type SubscriberCallback = () => void;

// Export event system types
export interface PlanEventSystem {
  subscribe: (callback: SubscriberCallback) => () => void;
  notify: () => void;
}
