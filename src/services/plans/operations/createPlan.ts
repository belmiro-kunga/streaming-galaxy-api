
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
    
    const newPlan: Omit<SubscriptionPlan, 'precos'> = {
      ...planDataWithoutPrecos,
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
          throw planError;
        }
        
        // Insert the prices if they exist
        if (precos && precos.length > 0) {
          const precosToInsert = precos.map(preco => ({
            plano_id: planData.id, // Use the ID returned from Supabase
            moeda_codigo: preco.moeda_codigo,
            preco: preco.preco
          }));
          
          const { error: precosError } = await supabase
            .from('precos_planos')
            .insert(precosToInsert);
          
          if (precosError) {
            console.error('[PlanAPI] Supabase error inserting prices:', precosError);
            throw precosError;
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
          throw fetchError;
        }
        
        // Notify subscribers about the change
        console.log("[PlanAPI] Created new plan in Supabase, notifying subscribers");
        eventSystem.notify();
        
        return { 
          data: completePlan as SubscriptionPlan,
          status: 201,
          message: 'Plano criado com sucesso'
        };
      } catch (supabaseError) {
        console.error('[PlanAPI] Error with Supabase operations:', supabaseError);
        // If Supabase operations fail, fall back to mock data
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
  } catch (error) {
    console.error('[PlanAPI] Error creating plan:', error);
    return {
      data: null as unknown as SubscriptionPlan,
      status: 500,
      message: `Erro ao criar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}
