
import { SubscriptionPlan } from '@/types/api';
import { plansMockDB } from '../mockData';
import { PlanEventSystem } from '../types';

// Update the mock database
export function updateMockData(
  newData: SubscriptionPlan[],
  eventSystem: PlanEventSystem
): void {
  // Clear the array
  plansMockDB.length = 0;
  
  // Add all new items
  plansMockDB.push(...newData);
  
  // Notify subscribers about the change
  console.log("[PlanAPI] Updated mock data, notifying subscribers");
  eventSystem.notify();
}

// Get a copy of the mock data
export function getMockData(): SubscriptionPlan[] {
  return [...plansMockDB]; // Return a copy to prevent accidental mutations
}
