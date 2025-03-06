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
    
    if (planIndex === -1 && !supabase?.auth) {
      return {
        data: null,
        status: 404,
        message: 'Plano não encontrado'
      };
    }
    
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // Verificar se temos uma URL e chave configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        console.log(`[PlanAPI] Deleting plan ${planId} from Supabase`);
        
        // First delete associated prices
        const { error: pricesError } = await supabase
          .from('precos_planos')
          .delete()
          .eq('plano_id', planId);
        
        if (pricesError) {
          console.error(`[PlanAPI] Supabase error deleting prices for plan ${planId}:`, pricesError);
          throw pricesError;
        }
        
        // Then delete the plan
        const { error: planError } = await supabase
          .from('planos_assinatura')
          .delete()
          .eq('id', planId);
        
        if (planError) {
          console.error(`[PlanAPI] Supabase error deleting plan ${planId}:`, planError);
          throw planError;
        }
        
        // Notify subscribers about the change
        console.log(`[PlanAPI] Deleted plan ${planId} from Supabase, notifying subscribers`);
        eventSystem.notify();
        
        return {
          data: null,
          status: 200,
          message: 'Plano excluído com sucesso'
        };
      }
    }
    
    // Otherwise use mock data
    if (planIndex !== -1) {
      plansMockDB.splice(planIndex, 1);
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
