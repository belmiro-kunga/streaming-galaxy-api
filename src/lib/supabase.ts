
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Project ID from config
const projectId = 'myvoecxoicxhklaxvgdi';

// If no URL is provided, construct it from the project ID
const finalSupabaseUrl = supabaseUrl || `https://${projectId}.supabase.co`;

// Test admin credentials for development
const TEST_ADMIN_EMAIL = 'admin@cineplay.com';
const TEST_ADMIN_PASSWORD = 'admin123';
const TEST_EDITOR_EMAIL = 'editor@cineplay.com';
const TEST_EDITOR_PASSWORD = 'editor123';
const TEST_SUPER_ADMIN_EMAIL = 'super@cineplay.com';
const TEST_SUPER_ADMIN_PASSWORD = 'super123';

// Create the Supabase client
export const supabase = createClient(
  finalSupabaseUrl, 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15dm9lY3hvaWN4aGtsYXh2Z2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTc3OTIsImV4cCI6MjA1NjY5Mzc5Mn0.XWLoIGayQvzdyQlFi8v9ziM991Xt44uOFT3FL58RkP8',
  {
    auth: {
      persistSession: true,
      storageKey: 'cineplay-supabase-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Log connection status
if (!finalSupabaseUrl || !supabaseAnonKey) {
  console.warn('Credenciais do Supabase não encontradas - usando cliente simulado.');
  console.info('Para conectar ao Supabase, defina as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
} else {
  console.log('Cliente Supabase inicializado com sucesso');
  console.log('Conectado a:', finalSupabaseUrl);
  console.log('Usando chave anônima:', supabaseAnonKey.substring(0, 10) + '...');
}

// Helper functions
export const getUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    console.error('Erro ao sair:', error);
    return { error };
  }
};

// Auth helpers for testing without Supabase
export const mockSignIn = async (email: string, password: string) => {
  // Verificar se estamos usando cliente real do Supabase
  if (finalSupabaseUrl && supabaseAnonKey) {
    console.log('Usando autenticação real do Supabase');
    try {
      // Usar autenticação real
      const result = await supabase.auth.signInWithPassword({ email, password });
      console.log('Resultado da autenticação:', result.data.user ? 'Sucesso' : 'Falha');
      return result;
    } catch (err) {
      console.error('Erro na autenticação com Supabase:', err);
      return {
        data: { user: null },
        error: err instanceof Error ? err : new Error("Erro na autenticação")
      };
    }
  }
  
  console.log('Usando autenticação simulada');
  // Simulação para desenvolvimento local
  if (email === TEST_ADMIN_EMAIL && password === TEST_ADMIN_PASSWORD) {
    return {
      data: {
        user: {
          id: '1',
          email: TEST_ADMIN_EMAIL,
          user_metadata: { 
            role: 'admin',
            first_name: 'Admin',
            last_name: 'User',
            phone: '123456789',
            country: 'Angola',
            province: 'Luanda'
          }
        }
      },
      error: null
    };
  } else if (email === TEST_EDITOR_EMAIL && password === TEST_EDITOR_PASSWORD) {
    return {
      data: {
        user: {
          id: '2',
          email: TEST_EDITOR_EMAIL,
          user_metadata: { 
            role: 'editor',
            first_name: 'Editor',
            last_name: 'User',
            phone: '987654321',
            country: 'Angola',
            province: 'Benguela'
          }
        }
      },
      error: null
    };
  } else if (email === TEST_SUPER_ADMIN_EMAIL && password === TEST_SUPER_ADMIN_PASSWORD) {
    return {
      data: {
        user: {
          id: '3',
          email: TEST_SUPER_ADMIN_EMAIL,
          user_metadata: { 
            role: 'super_admin',
            first_name: 'Super',
            last_name: 'Admin',
            phone: '555555555',
            country: 'Angola',
            province: 'Huambo'
          }
        }
      },
      error: null
    };
  } else {
    return {
      data: { user: null },
      error: new Error("Credenciais inválidas")
    };
  }
};

// Supabase direct helper for plan management to ensure data is properly saved
export const directSupabaseApi = {
  async createPlan(planData) {
    console.log("[DirectSupabaseAPI] Creating plan directly:", planData);
    
    try {
      // Prepare the plan data (without precos)
      const { precos, ...planDataWithoutPrecos } = planData;
      
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
      return {
        data: null,
        status: 500,
        message: `Erro ao criar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  },
  
  async updatePlan(planId, planData) {
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
  
  async deletePlan(planId) {
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
  
  async togglePlanStatus(planId, active) {
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
