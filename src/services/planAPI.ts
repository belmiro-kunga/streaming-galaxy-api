import { SubscriptionPlan, PlanPrice, ApiResponse } from '@/types/api';
import { supabase } from '@/lib/supabase';

// Mock database for subscription plans
let plansMockDB: SubscriptionPlan[] = [
  { 
    id: "weekly",
    nome: "Plano Semanal",
    descricao: "Ideal para períodos curtos",
    qualidade_maxima: "HD",
    telas_simultaneas: 1,
    limite_downloads: 5,
    limite_perfis: 1,
    ciclo_cobranca: "semanal",
    ativo: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    precos: [{ plano_id: "weekly", moeda_codigo: "AOA", preco: 500 }]
  },
  { 
    id: "biweekly",
    nome: "Plano Quinzenal",
    descricao: "Para quem deseja mais flexibilidade",
    qualidade_maxima: "HD",
    telas_simultaneas: 2,
    limite_downloads: 10,
    limite_perfis: 2,
    ciclo_cobranca: "quinzenal",
    ativo: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    precos: [{ plano_id: "biweekly", moeda_codigo: "AOA", preco: 850 }]
  },
  { 
    id: "standard",
    nome: "Standard",
    descricao: "Nossa opção mais popular",
    qualidade_maxima: "HD",
    telas_simultaneas: 2,
    limite_downloads: 20,
    limite_perfis: 3,
    ciclo_cobranca: "mensal",
    ativo: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    precos: [{ plano_id: "standard", moeda_codigo: "AOA", preco: 3000 }]
  },
  { 
    id: "premium",
    nome: "Premium",
    descricao: "Melhor experiência para famílias",
    qualidade_maxima: "Ultra HD",
    telas_simultaneas: 4,
    limite_downloads: 40,
    limite_perfis: 6,
    ciclo_cobranca: "mensal",
    ativo: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    precos: [{ plano_id: "premium", moeda_codigo: "AOA", preco: 5000 }]
  }
];

export const planAPI = {
  // Get all subscription plans
  getAllPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      // If we have Supabase configured, use it
      if (supabase?.auth) {
        // In a real implementation, this would query the Supabase database
        // const { data, error } = await supabase.from('planos_assinatura').select('*');
        // if (error) throw error;
        // return data;
      }
      
      // Otherwise use mock data
      return plansMockDB.filter(plan => plan.ativo);
    } catch (error) {
      console.error('Error fetching plans:', error);
      return plansMockDB.filter(plan => plan.ativo);
    }
  },
  
  // Get plan by ID
  getPlanById: async (planId: string): Promise<SubscriptionPlan | null> => {
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
      console.error(`Error fetching plan ${planId}:`, error);
      return null;
    }
  },
  
  // Create a new subscription plan
  createPlan: async (planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<SubscriptionPlan>> => {
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
      
      // Otherwise use mock data
      plansMockDB.push(newPlan);
      return { 
        data: newPlan,
        status: 201,
        message: 'Plano criado com sucesso'
      };
    } catch (error) {
      console.error('Error creating plan:', error);
      return {
        data: null as unknown as SubscriptionPlan,
        status: 500,
        message: `Erro ao criar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  },
  
  // Update an existing subscription plan
  updatePlan: async (planId: string, planData: Partial<SubscriptionPlan>): Promise<ApiResponse<SubscriptionPlan>> => {
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
      
      return {
        data: updatedPlan,
        status: 200,
        message: 'Plano atualizado com sucesso'
      };
    } catch (error) {
      console.error(`Error updating plan ${planId}:`, error);
      return {
        data: null as unknown as SubscriptionPlan,
        status: 500,
        message: `Erro ao atualizar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  },
  
  // Activate or deactivate a subscription plan
  togglePlanStatus: async (planId: string, active: boolean): Promise<ApiResponse<SubscriptionPlan>> => {
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
      
      return {
        data: updatedPlan,
        status: 200,
        message: `Plano ${active ? 'ativado' : 'desativado'} com sucesso`
      };
    } catch (error) {
      console.error(`Error updating plan status ${planId}:`, error);
      return {
        data: null as unknown as SubscriptionPlan,
        status: 500,
        message: `Erro ao atualizar status do plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  },
  
  // Delete a subscription plan
  deletePlan: async (planId: string): Promise<ApiResponse<null>> => {
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
      plansMockDB = plansMockDB.filter(p => p.id !== planId);
      
      return {
        data: null,
        status: 200,
        message: 'Plano excluído com sucesso'
      };
    } catch (error) {
      console.error(`Error deleting plan ${planId}:`, error);
      return {
        data: null,
        status: 500,
        message: `Erro ao excluir plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  },
  
  // Export the mock database for use in other components
  getMockData: () => plansMockDB,
  updateMockData: (newData: SubscriptionPlan[]) => {
    plansMockDB = newData;
  }
};
