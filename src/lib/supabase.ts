
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Test admin credentials
const TEST_ADMIN_EMAIL = 'admin@cineplay.com';
const TEST_ADMIN_PASSWORD = 'admin123';
const TEST_EDITOR_EMAIL = 'editor@cineplay.com';
const TEST_EDITOR_PASSWORD = 'editor123';
const TEST_SUPER_ADMIN_EMAIL = 'super@cineplay.com';
const TEST_SUPER_ADMIN_PASSWORD = 'super123';

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://sua-url-do-supabase.supabase.co', 
  supabaseAnonKey || 'sua-chave-anonima-do-supabase'
);

// Verificar a conexão e registrar status
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Credenciais do Supabase não encontradas - usando cliente simulado.');
  console.info('Para conectar ao Supabase, defina as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
} else {
  console.log('Cliente Supabase inicializado com sucesso');
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
  if (supabaseUrl && supabaseAnonKey) {
    // Usar autenticação real
    return await supabase.auth.signInWithPassword({ email, password });
  }
  
  // Simulação para desenvolvimento local
  if (email === TEST_ADMIN_EMAIL && password === TEST_ADMIN_PASSWORD) {
    return {
      data: {
        user: {
          id: '1',
          email: TEST_ADMIN_EMAIL,
          user_metadata: { role: 'admin' }
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
          user_metadata: { role: 'editor' }
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
          user_metadata: { role: 'super_admin' }
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
