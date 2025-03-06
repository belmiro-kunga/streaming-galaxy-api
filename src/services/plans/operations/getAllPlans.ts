
import { SubscriptionPlan } from '@/types/api';
import { supabase } from '@/lib/supabase';
import { plansMockDB } from '../mockData';

// Get all subscription plans
export async function getAllPlans(): Promise<SubscriptionPlan[]> {
  console.log("[PlanAPI] Getting all plans");
  try {
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // Verificar se temos uma URL e chave configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        console.log("[PlanAPI] Fetching plans from Supabase");
        const { data, error } = await supabase.from('planos_assinatura').select('*');
        
        if (error) {
          console.error('[PlanAPI] Supabase error:', error);
          throw error;
        }
        
        console.log("[PlanAPI] Returned plans from Supabase, count:", data?.length);
        return data || [];
      } else {
        console.log("[PlanAPI] Supabase credentials not found, using mock data");
      }
    }
    
    // Otherwise use mock data
    console.log("[PlanAPI] Returning plans from mock DB, count:", plansMockDB.length);
    return [...plansMockDB]; // Return a copy to prevent accidental mutations
  } catch (error) {
    console.error('[PlanAPI] Error fetching plans:', error);
    return [...plansMockDB]; // Return a copy to prevent accidental mutations
  }
}
