import { ApiResponse } from '@/types/api';
import { supabase } from '@/lib/supabase';
import { plansMockDB } from '../mockData';
import { PlanEventSystem } from '../types';

// Delete a subscription plan
export async function deletePlan(
  planId: string,
  eventSystem: PlanEventSystem
): Promise<ApiResponse<null>> {
  try {
    // Find the plan to delete
    const planIndex = plansMockDB.findIndex(p => p.id === planId);
    
    if (planIndex === -1) {
      return {
        data: null,
        status: 404,
        message: 'Plano não encontrado'
      };
    }
    
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // In a real implementation, this would delete from the Supabase database
      // const { error } = await supabase.from('planos_assinatura').delete().eq('id', planId);
      // if (error) throw error;
    }
    
    // Otherwise use mock data
    const index = plansMockDB.findIndex(p => p.id === planId);
    if (index !== -1) {
      plansMockDB.splice(index, 1);
    }
    
    // Notify subscribers about the change
    console.log(`[PlanAPI] Deleted plan ${planId}, notifying subscribers`);
    eventSystem.notify();
    
    return {
      data: null,
      status: 200,
      message: 'Plano excluído com sucesso'
    };
  } catch (error) {
    console.error(`[PlanAPI] Error deleting plan ${planId}:`, error);
    return {
      data: null,
      status: 500,
      message: `Erro ao excluir plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}
