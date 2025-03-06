
import { createPlan } from './operations/createPlan';
import { updatePlan } from './operations/updatePlan';
import { deletePlan } from './operations/deletePlan';
import { getAllPlans } from './operations/getAllPlans';
import { getPlanById } from './operations/getPlanById';
import { togglePlanStatus } from './operations/togglePlanStatus';
import { updateMockData, getMockData } from './operations/mockData';
import { createEventSystem } from './eventSystem';
import { SubscriptionPlan } from '@/types/api';
import { SubscriberCallback } from './types';

// Create the event system
const planEventSystem = createEventSystem();

// Export the API operations as a unified object
export const planAPI = {
  // Data operations
  getAllPlans,
  getPlanById,
  createPlan: (planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>) => 
    createPlan(planData, planEventSystem),
  updatePlan: (planId: string, planData: Partial<SubscriptionPlan>) => 
    updatePlan(planId, planData, planEventSystem),
  togglePlanStatus: (planId: string, active: boolean) => 
    togglePlanStatus(planId, active, planEventSystem),
  deletePlan: (planId: string) => 
    deletePlan(planId, planEventSystem),
  
  // Mock data utilities
  updateMockData: (newData: SubscriptionPlan[]) => 
    updateMockData(newData, planEventSystem),
  getMockData,
  
  // Event subscription
  subscribeToChanges: (callback: SubscriberCallback) => 
    planEventSystem.subscribe(callback)
};
