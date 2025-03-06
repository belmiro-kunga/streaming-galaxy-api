import { SubscriptionPlan } from '@/types/api';
import { supabase } from '@/lib/supabase';
import { plansMockDB } from '../mockData';

// Get plan by ID
export async function getPlanById(planId: string): Promise<SubscriptionPlan | null> {
  try {
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // In a real implementation, this would query the Supabase database
      // const { data, error } = await supabase.from('planos_assinatura').select('*').eq('id', planId).single();
      // if (error) throw error;
      // return data;
    }
    
    // Otherwise use mock data
    const plan = plansMockDB.find(p => p.id === planId);
    return plan || null;
  } catch (error) {
    console.error(`[PlanAPI] Error fetching plan ${planId}:`, error);
    return null;
  }
}
