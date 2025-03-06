import { SubscriptionPlan } from '@/types/api';
import { supabase } from '@/lib/supabase';
import { plansMockDB } from '../mockData';

// Get all subscription plans
export async function getAllPlans(): Promise<SubscriptionPlan[]> {
  console.log("[PlanAPI] Getting all plans");
  try {
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // In a real implementation, this would query the Supabase database
      // const { data, error } = await supabase.from('planos_assinatura').select('*');
      // if (error) throw error;
      // return data;
    }
    
    // Otherwise use mock data
    console.log("[PlanAPI] Returning plans from mock DB, count:", plansMockDB.length);
    return [...plansMockDB]; // Return a copy to prevent accidental mutations
  } catch (error) {
    console.error('[PlanAPI] Error fetching plans:', error);
    return [...plansMockDB]; // Return a copy to prevent accidental mutations
  }
}
