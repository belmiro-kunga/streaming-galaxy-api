
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
    
    // Prepare the plan data (without precos)
    const { precos, ...planDataWithoutPrecos } = planData;
    
    // Ensure all numeric fields are properly converted to numbers
    const sanitizedPlanData = {
      ...planDataWithoutPrecos,
      telas_simultaneas: Number(planDataWithoutPrecos.telas_simultaneas) || 1,
      limite_downloads: Number(planDataWithoutPrecos.limite_downloads) || 0,
      limite_perfis: Number(planDataWithoutPrecos.limite_perfis) || 1
    };
    
    const newPlan: Omit<SubscriptionPlan, 'precos'> = {
      ...sanitizedPlanData,
      id: newId,
      created_at: now,
      updated_at: now
    };
    
    // Check Supabase configuration
    if (supabase?.auth) {
      console.log("[PlanAPI] Creating new plan in Supabase");
      
      try {
        // Insert the plan
        const { data: planData, error: planError } = await supabase
          .from('planos_assinatura')
          .insert(newPlan)
          .select()
          .single();
        
        if (planError) {
          console.error('[PlanAPI] Supabase error creating plan:', planError);
          return {
            data: null as unknown as SubscriptionPlan,
            status: 500,
            message: `Erro ao criar plano: ${planError.message || planError.details || 'Erro desconhecido'}`
          };
        }
        
        // Insert the prices if they exist
        if (precos && precos.length > 0) {
          const precosToInsert = precos.map(preco => ({
            plano_id: planData.id, // Use the ID returned from Supabase
            moeda_codigo: preco.moeda_codigo,
            preco: Number(preco.preco) || 0
          }));
          
          const { error: precosError } = await supabase
            .from('precos_planos')
            .insert(precosToInsert);
          
          if (precosError) {
            console.error('[PlanAPI] Supabase error inserting prices:', precosError);
            return {
              data: null as unknown as SubscriptionPlan,
              status: 500,
              message: `Erro ao inserir preços: ${precosError.message || precosError.details || 'Erro desconhecido'}`
            };
          }
        }
        
        // Get the complete plan with prices
        const { data: completePlan, error: fetchError } = await supabase
          .from('planos_assinatura')
          .select('*, precos:precos_planos(*)')
          .eq('id', planData.id)
          .single();
        
        if (fetchError) {
          console.error('[PlanAPI] Supabase error fetching complete plan:', fetchError);
          return {
            data: planData as unknown as SubscriptionPlan,
            status: 201,
            message: 'Plano criado, mas não foi possível carregar os detalhes completos'
          };
        }
        
        // Notify subscribers about the change
        console.log("[PlanAPI] Created new plan in Supabase, notifying subscribers");
        eventSystem.notify();
        
        return { 
          data: completePlan as SubscriptionPlan,
          status: 201,
          message: 'Plano criado com sucesso'
        };
      } catch (supabaseError: any) {
        console.error('[PlanAPI] Error with Supabase operations:', supabaseError);
        return {
          data: null as unknown as SubscriptionPlan,
          status: 500,
          message: `Erro interno: ${supabaseError?.message || 'Erro desconhecido'}`
        };
      }
    }
    
    // Fallback to using mock data
    console.log("[PlanAPI] Falling back to mock database for plan creation");
    
    const completePlan: SubscriptionPlan = {
      ...newPlan as any,
      precos: precos?.map(preco => ({
        ...preco,
        plano_id: newId
      })) || []
    };
    
    plansMockDB.push(completePlan);
    
    // Notify subscribers about the change
    console.log("[PlanAPI] Created new plan in mock DB, notifying subscribers");
    eventSystem.notify();
    
    return { 
      data: completePlan,
      status: 201,
      message: 'Plano criado com sucesso'
    };
  } catch (error: any) {
    console.error('[PlanAPI] Error creating plan:', error);
    return {
      data: null as unknown as SubscriptionPlan,
      status: 500,
      message: `Erro ao criar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}
