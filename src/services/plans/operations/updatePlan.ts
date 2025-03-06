
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
    
    if (planIndex === -1 && !supabase?.auth) {
      return {
        data: null as unknown as SubscriptionPlan,
        status: 404,
        message: 'Plano não encontrado'
      };
    }
    
    // Extract prices from plan data
    const { precos, ...planDataWithoutPrecos } = planData;
    
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // Verificar se temos uma URL e chave configuradas
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        console.log(`[PlanAPI] Updating plan ${planId} in Supabase`);
        
        // Update plan data
        const { error: planError } = await supabase
          .from('planos_assinatura')
          .update({
            ...planDataWithoutPrecos,
            updated_at: new Date().toISOString()
          })
          .eq('id', planId);
        
        if (planError) {
          console.error(`[PlanAPI] Supabase error updating plan ${planId}:`, planError);
          throw planError;
        }
        
        // Update prices if provided
        if (precos && precos.length > 0) {
          // First delete existing prices
          const { error: deleteError } = await supabase
            .from('precos_planos')
            .delete()
            .eq('plano_id', planId);
          
          if (deleteError) {
            console.error(`[PlanAPI] Supabase error deleting prices for plan ${planId}:`, deleteError);
            throw deleteError;
          }
          
          // Then insert new prices
          const precosToInsert = precos.map(preco => ({
            plano_id: planId,
            moeda_codigo: preco.moeda_codigo,
            preco: preco.preco
          }));
          
          const { error: insertError } = await supabase
            .from('precos_planos')
            .insert(precosToInsert);
          
          if (insertError) {
            console.error(`[PlanAPI] Supabase error inserting prices for plan ${planId}:`, insertError);
            throw insertError;
          }
        }
        
        // Get updated plan
        const { data: updatedPlan, error: fetchError } = await supabase
          .from('planos_assinatura')
          .select('*, precos:precos_planos(*)')
          .eq('id', planId)
          .single();
        
        if (fetchError) {
          console.error(`[PlanAPI] Supabase error fetching updated plan ${planId}:`, fetchError);
          throw fetchError;
        }
        
        // Notify subscribers about the change
        console.log(`[PlanAPI] Updated plan ${planId} in Supabase, notifying subscribers`);
        eventSystem.notify();
        
        return { 
          data: updatedPlan as SubscriptionPlan,
          status: 200,
          message: 'Plano atualizado com sucesso'
        };
      }
    }
    
    // Otherwise use mock data
    const updatedPlan: SubscriptionPlan = {
      ...plansMockDB[planIndex],
      ...planDataWithoutPrecos,
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
