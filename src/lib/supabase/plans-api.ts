
import { supabase } from './client';
import { SubscriptionPlan } from '@/types/api';

// Supabase direct helper for plan management to ensure data is properly saved
export const directSupabaseApi = {
  async createPlan(planData: any) {
    console.log("[DirectSupabaseAPI] Creating plan directly:", planData);
    
    try {
      // Prepare the plan data (without precos)
      const { precos, ...planDataWithoutPrecos } = planData;
      
      // Important: Make sure limite_perfis is present
      if (!planDataWithoutPrecos.limite_perfis) {
        planDataWithoutPrecos.limite_perfis = 1; // Set default if missing
      }
      
      // Insert the plan
      const { data: planDataResult, error: planError } = await supabase
        .from('planos_assinatura')
        .insert(planDataWithoutPrecos)
        .select()
        .single();
        
      if (planError) {
        console.error('[DirectSupabaseAPI] Error creating plan:', planError);
        throw planError;
      }
      
      console.log('[DirectSupabaseAPI] Plan created successfully:', planDataResult);
      
      // Insert the prices if they exist
      if (precos && precos.length > 0) {
        const precosToInsert = precos.map(preco => ({
          plano_id: planDataResult.id,
          moeda_codigo: preco.moeda_codigo,
          preco: preco.preco
        }));
        
        const { error: precosError } = await supabase
          .from('precos_planos')
          .insert(precosToInsert);
        
        if (precosError) {
          console.error('[DirectSupabaseAPI] Error inserting prices:', precosError);
          throw precosError;
        }
        
        console.log('[DirectSupabaseAPI] Prices inserted successfully:', precosToInsert);
      }
      
      // Get the complete plan with prices
      const { data: completePlan, error: fetchError } = await supabase
        .from('planos_assinatura')
        .select('*, precos:precos_planos(*)')
        .eq('id', planDataResult.id)
        .single();
      
      if (fetchError) {
        console.error('[DirectSupabaseAPI] Error fetching complete plan:', fetchError);
        throw fetchError;
      }
      
      return { 
        data: completePlan,
        status: 201,
        message: 'Plano criado com sucesso'
      };
    } catch (error) {
      console.error('[DirectSupabaseAPI] Error in createPlan:', error);
      // Return a more detailed error message
      return {
        data: null,
        status: 500,
        message: `Erro ao criar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  },
  
  async updatePlan(planId: string, planData: any) {
    console.log(`[DirectSupabaseAPI] Updating plan ${planId} directly:`, planData);
    
    try {
      // Extract prices from plan data
      const { precos, ...planDataWithoutPrecos } = planData;
      
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
        console.error(`[DirectSupabaseAPI] Error updating plan ${planId}:`, planError);
        throw planError;
      }
      
      console.log(`[DirectSupabaseAPI] Plan ${planId} updated successfully`);
      
      // Update prices if provided
      if (precos && precos.length > 0) {
        // First delete existing prices
        const { error: deleteError } = await supabase
          .from('precos_planos')
          .delete()
          .eq('plano_id', planId);
        
        if (deleteError) {
          console.error(`[DirectSupabaseAPI] Error deleting prices for plan ${planId}:`, deleteError);
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
          console.error(`[DirectSupabaseAPI] Error inserting prices for plan ${planId}:`, insertError);
          throw insertError;
        }
        
        console.log(`[DirectSupabaseAPI] Prices for plan ${planId} updated successfully:`, precosToInsert);
      }
      
      // Get updated plan
      const { data: updatedPlan, error: fetchError } = await supabase
        .from('planos_assinatura')
        .select('*, precos:precos_planos(*)')
        .eq('id', planId)
        .single();
      
      if (fetchError) {
        console.error(`[DirectSupabaseAPI] Error fetching updated plan ${planId}:`, fetchError);
        throw fetchError;
      }
      
      return { 
        data: updatedPlan,
        status: 200,
        message: 'Plano atualizado com sucesso'
      };
    } catch (error) {
      console.error(`[DirectSupabaseAPI] Error in updatePlan ${planId}:`, error);
      return {
        data: null,
        status: 500,
        message: `Erro ao atualizar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  },
  
  async deletePlan(planId: string) {
    console.log(`[DirectSupabaseAPI] Deleting plan ${planId} directly`);
    
    try {
      // First delete associated prices
      const { error: pricesError } = await supabase
        .from('precos_planos')
        .delete()
        .eq('plano_id', planId);
      
      if (pricesError) {
        console.error(`[DirectSupabaseAPI] Error deleting prices for plan ${planId}:`, pricesError);
        throw pricesError;
      }
      
      // Then delete the plan
      const { error: planError } = await supabase
        .from('planos_assinatura')
        .delete()
        .eq('id', planId);
      
      if (planError) {
        console.error(`[DirectSupabaseAPI] Error deleting plan ${planId}:`, planError);
        throw planError;
      }
      
      console.log(`[DirectSupabaseAPI] Plan ${planId} deleted successfully`);
      
      return {
        data: null,
        status: 200,
        message: 'Plano excluído com sucesso'
      };
    } catch (error) {
      console.error(`[DirectSupabaseAPI] Error in deletePlan ${planId}:`, error);
      return {
        data: null,
        status: 500,
        message: `Erro ao excluir plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  },
  
  async togglePlanStatus(planId: string, active: boolean) {
    console.log(`[DirectSupabaseAPI] Toggling plan ${planId} status to ${active} directly`);
    
    try {
      // Update plan status
      const { error: updateError } = await supabase
        .from('planos_assinatura')
        .update({
          ativo: active,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId);
      
      if (updateError) {
        console.error(`[DirectSupabaseAPI] Error toggling plan status ${planId}:`, updateError);
        throw updateError;
      }
      
      console.log(`[DirectSupabaseAPI] Plan ${planId} status toggled to ${active} successfully`);
      
      // Get updated plan
      const { data: updatedPlan, error: fetchError } = await supabase
        .from('planos_assinatura')
        .select('*, precos:precos_planos(*)')
        .eq('id', planId)
        .single();
      
      if (fetchError) {
        console.error(`[DirectSupabaseAPI] Error fetching updated plan ${planId}:`, fetchError);
        throw fetchError;
      }
      
      return {
        data: updatedPlan,
        status: 200,
        message: `Plano ${active ? 'ativado' : 'desativado'} com sucesso`
      };
    } catch (error) {
      console.error(`[DirectSupabaseAPI] Error in togglePlanStatus ${planId}:`, error);
      return {
        data: null,
        status: 500,
        message: `Erro ao atualizar status do plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  },
  
  async getAllPlans() {
    console.log("[DirectSupabaseAPI] Getting all plans directly");
    
    try {
      const { data, error } = await supabase
        .from('planos_assinatura')
        .select('*, precos:precos_planos(*)');
      
      if (error) {
        console.error('[DirectSupabaseAPI] Error fetching plans:', error);
        throw error;
      }
      
      console.log('[DirectSupabaseAPI] Fetched plans successfully, count:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('[DirectSupabaseAPI] Error in getAllPlans:', error);
      return [];
    }
  }
};
