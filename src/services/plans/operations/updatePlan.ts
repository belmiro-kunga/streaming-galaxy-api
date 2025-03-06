import { SubscriptionPlan, ApiResponse } from '@/types/api';
import { supabase } from '@/lib/supabase';
import { plansMockDB } from '../mockData';
import { PlanEventSystem } from '../types';

// Update an existing subscription plan
export async function updatePlan(
  planId: string, 
  planData: Partial<SubscriptionPlan>,
  eventSystem: PlanEventSystem
): Promise<ApiResponse<SubscriptionPlan>> {
  try {
    // Find the plan to update
    const planIndex = plansMockDB.findIndex(p => p.id === planId);
    
    if (planIndex === -1) {
      return {
        data: null as unknown as SubscriptionPlan,
        status: 404,
        message: 'Plano não encontrado'
      };
    }
    
    // Make sure the prices have the correct plan_id
    const precos = planData.precos?.map(preco => ({
      ...preco,
      plano_id: planId
    }));
    
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // In a real implementation, this would update the Supabase database
      // const { data, error } = await supabase.from('planos_assinatura').update({
      //   ...planData,
      //   precos: precos,
      //   updated_at: new Date().toISOString()
      // }).eq('id', planId).select().single();
      // if (error) throw error;
      // return { data, status: 200, message: 'Plano atualizado com sucesso' };
    }
    
    // Otherwise use mock data
    const updatedPlan: SubscriptionPlan = {
      ...plansMockDB[planIndex],
      ...planData,
      precos: precos || plansMockDB[planIndex].precos,
      updated_at: new Date().toISOString()
    };
    
    plansMockDB[planIndex] = updatedPlan;
    
    // Notify subscribers about the change
    console.log(`[PlanAPI] Updated plan ${planId}, notifying subscribers`);
    eventSystem.notify();
    
    return {
      data: updatedPlan,
      status: 200,
      message: 'Plano atualizado com sucesso'
    };
  } catch (error) {
    console.error(`[PlanAPI] Error updating plan ${planId}:`, error);
    return {
      data: null as unknown as SubscriptionPlan,
      status: 500,
      message: `Erro ao atualizar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}
