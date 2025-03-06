
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
