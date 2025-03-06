
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
    
    // Extract prices from plan data
    const { precos, ...planDataWithoutPrecos } = planData;
    
    // Check Supabase configuration
    if (supabase?.auth) {
      console.log(`[PlanAPI] Updating plan ${planId} in Supabase`);
      
      try {
        // Update plan data
        const updateData = {
          ...planDataWithoutPrecos,
          updated_at: new Date().toISOString()
        };
        
        const { error: planError } = await supabase
          .from('planos_assinatura')
          .update(updateData)
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
      } catch (supabaseError) {
        console.error(`[PlanAPI] Error with Supabase operations:`, supabaseError);
        // If Supabase operations fail, fall back to mock data
      }
    }
    
    // Fallback to using mock data
    console.log(`[PlanAPI] Falling back to mock database for plan update`);
    
    if (planIndex === -1) {
      return {
        data: null as unknown as SubscriptionPlan,
        status: 404,
        message: 'Plano não encontrado'
      };
    }
    
    const updatedPlan: SubscriptionPlan = {
      ...plansMockDB[planIndex],
      ...planDataWithoutPrecos,
      precos: precos || plansMockDB[planIndex].precos,
      updated_at: new Date().toISOString()
    };
    
    plansMockDB[planIndex] = updatedPlan;
    
    // Notify subscribers about the change
    console.log(`[PlanAPI] Updated plan ${planId} in mock DB, notifying subscribers`);
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
