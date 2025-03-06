import { SubscriptionPlan, ApiResponse } from '@/types/api';
import { supabase } from '@/lib/supabase';
import { plansMockDB } from '../mockData';
import { PlanEventSystem } from '../types';

// Activate or deactivate a subscription plan
export async function togglePlanStatus(
  planId: string, 
  active: boolean,
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
    
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // Verificar se temos uma URL e chave configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        console.log(`[PlanAPI] Toggling plan status to ${active} for plan ${planId} in Supabase`);
        const { data, error } = await supabase.from('planos_assinatura').update({
          ativo: active,
          updated_at: new Date().toISOString()
        }).eq('id', planId).select().single();
        
        if (error) {
          console.error(`[PlanAPI] Supabase error toggling plan status ${planId}:`, error);
          throw error;
        }
        
        // Notify subscribers about the change
        console.log(`[PlanAPI] Toggled plan status to ${active} for plan ${planId} in Supabase, notifying subscribers`);
        eventSystem.notify();
        
        return {
          data: data as SubscriptionPlan,
          status: 200,
          message: `Plano ${active ? 'ativado' : 'desativado'} com sucesso`
        };
      }
    }
    
    // Otherwise use mock data
    const updatedPlan: SubscriptionPlan = {
      ...plansMockDB[planIndex],
      ativo: active,
      updated_at: new Date().toISOString()
    };
    
    plansMockDB[planIndex] = updatedPlan;
    
    // Notify subscribers about the change
    console.log(`[PlanAPI] Toggled plan status to ${active} for plan ${planId}, notifying subscribers`);
    eventSystem.notify();
    
    return {
      data: updatedPlan,
      status: 200,
      message: `Plano ${active ? 'ativado' : 'desativado'} com sucesso`
    };
  } catch (error) {
    console.error(`[PlanAPI] Error updating plan status ${planId}:`, error);
    return {
      data: null as unknown as SubscriptionPlan,
      status: 500,
      message: `Erro ao atualizar status do plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}
