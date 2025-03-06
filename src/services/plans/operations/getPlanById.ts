
import { SubscriptionPlan } from '@/types/api';
import { supabase } from '@/lib/supabase';
import { plansMockDB } from '../mockData';

// Get plan by ID
export async function getPlanById(planId: string): Promise<SubscriptionPlan | null> {
  try {
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // Verificar se temos uma URL e chave configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        console.log(`[PlanAPI] Fetching plan ${planId} from Supabase`);
        const { data, error } = await supabase.from('planos_assinatura').select('*').eq('id', planId).single();
        
        if (error) {
          console.error(`[PlanAPI] Supabase error fetching plan ${planId}:`, error);
          throw error;
        }
        
        return data || null;
      }
    }
    
    // Otherwise use mock data
    const plan = plansMockDB.find(p => p.id === planId);
    return plan || null;
  } catch (error) {
    console.error(`[PlanAPI] Error fetching plan ${planId}:`, error);
    return null;
  }
}
