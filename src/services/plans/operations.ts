import { SubscriptionPlan, ApiResponse } from '@/types/api';
import { supabase } from '@/lib/supabase';
import { plansMockDB } from './mockData';
import { PlanEventSystem, SubscriberCallback } from './types';
import { createEventSystem } from './eventSystem';

// Create the event system
const planEventSystem = createEventSystem();

// Export the API operations as a unified object
export const planAPI = {
  // Data operations
  getAllPlans,
  getPlanById,
  createPlan: (planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>) => 
    createPlan(planData, planEventSystem),
  updatePlan: (planId: string, planData: Partial<SubscriptionPlan>) => 
    updatePlan(planId, planData, planEventSystem),
  togglePlanStatus: (planId: string, active: boolean) => 
    togglePlanStatus(planId, active, planEventSystem),
  deletePlan: (planId: string) => 
    deletePlan(planId, planEventSystem),
  
  // Mock data utilities
  updateMockData: (newData: SubscriptionPlan[]) => 
    updateMockData(newData, planEventSystem),
  getMockData,
  
  // Event subscription
  subscribeToChanges: (callback: SubscriberCallback) => 
    planEventSystem.subscribe(callback)
};

// Get all subscription plans
async function getAllPlans(): Promise<SubscriptionPlan[]> {
  console.log("[PlanAPI] Getting all plans");
  try {
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // In a real implementation, this would query the Supabase database
      // const { data, error } = await supabase.from('planos_assinatura').select('*');
      // if (error) throw error;
      // return data;
    }
    
    // Otherwise use mock data
    console.log("[PlanAPI] Returning plans from mock DB, count:", plansMockDB.length);
    return [...plansMockDB]; // Return a copy to prevent accidental mutations
  } catch (error) {
    console.error('[PlanAPI] Error fetching plans:', error);
    return [...plansMockDB]; // Return a copy to prevent accidental mutations
  }
}

// Get plan by ID
async function getPlanById(planId: string): Promise<SubscriptionPlan | null> {
  try {
    // If we have Supabase configured, use it
    if (supabase?.auth) {
      // In a real implementation, this would query the Supabase database
      // const { data, error } = await supabase.from('planos_assinatura').select('*').eq('id', planId).single();
      // if (error) throw error;
      // return data;
    }
    
    // Otherwise use mock data
    const plan = plansMockDB.find(p => p.id === planId);
    return plan || null;
  } catch (error) {
    console.error(`[PlanAPI] Error fetching plan ${planId}:`, error);
    return null;
  }
}

// Create a new subscription plan
async function createPlan(
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
      // In a real implementation, this would insert into the Supabase database
      // const { data, error } = await supabase.from('planos_assinatura').insert(newPlan).select().single();
      // if (error) throw error;
      // return { data, status: 201, message: 'Plano criado com sucesso' };
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

// Update an existing subscription plan
async function updatePlan(
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

// Activate or deactivate a subscription plan
async function togglePlanStatus(
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
      // In a real implementation, this would update the Supabase database
      // const { data, error } = await supabase.from('planos_assinatura').update({
      //   ativo: active,
      //   updated_at: new Date().toISOString()
      // }).eq('id', planId).select().single();
      // if (error) throw error;
      // return { data, status: 200, message: `Plano ${active ? 'ativado' : 'desativado'} com sucesso` };
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

// Delete a subscription plan
async function deletePlan(
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

// Update the mock database
function updateMockData(
  newData: SubscriptionPlan[],
  eventSystem: PlanEventSystem
): void {
  // Clear the array
  plansMockDB.length = 0;
  
  // Add all new items
  plansMockDB.push(...newData);
  
  // Notify subscribers about the change
  console.log("[PlanAPI] Updated mock data, notifying subscribers");
  eventSystem.notify();
}

// Get a copy of the mock data
function getMockData(): SubscriptionPlan[] {
  return [...plansMockDB]; // Return a copy to prevent accidental mutations
}
