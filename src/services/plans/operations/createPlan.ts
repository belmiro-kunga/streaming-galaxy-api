
import { SubscriptionPlan, ApiResponse } from '@/types/api';
import { supabase } from '@/lib/supabase';
import { plansMockDB } from '../mockData';
import { PlanEventSystem } from '../types';

// Create a new subscription plan
export async function createPlan(
  planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>,
  eventSystem: PlanEventSystem
): Promise<ApiResponse<SubscriptionPlan>> {
  try {
    const now = new Date().toISOString();
    const newId = `plan-${Date.now()}`;
    
    // Make sure the prices have the correct plan_id
    const precos = planData.precos?.map(preco => ({
      ...preco,
      plano_id: newId
    })) || [];
    
    const newPlan: SubscriptionPlan = {
      ...planData,
      id: newId,
      created_at: now,
      updated_at: now,
      precos: precos
    };
    
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // Verificar se temos uma URL e chave configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        console.log("[PlanAPI] Creating new plan in Supabase");
        const { data, error } = await supabase.from('planos_assinatura').insert(newPlan).select().single();
        
        if (error) {
          console.error('[PlanAPI] Supabase error creating plan:', error);
          throw error;
        }
        
        // Notify subscribers about the change
        console.log("[PlanAPI] Created new plan in Supabase, notifying subscribers");
        eventSystem.notify();
        
        return { 
          data: data as SubscriptionPlan,
          status: 201,
          message: 'Plano criado com sucesso'
        };
      }
    }
    
    // Add to mock database
    plansMockDB.push(newPlan);
    
    // Notify subscribers about the change
    console.log("[PlanAPI] Created new plan, notifying subscribers");
    eventSystem.notify();
    
    return { 
      data: newPlan,
      status: 201,
      message: 'Plano criado com sucesso'
    };
  } catch (error) {
    console.error('[PlanAPI] Error creating plan:', error);
    return {
      data: null as unknown as SubscriptionPlan,
      status: 500,
      message: `Erro ao criar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}
