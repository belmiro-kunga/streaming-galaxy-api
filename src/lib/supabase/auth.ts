
import { supabase } from './client';

// Test admin credentials for development
export const TEST_ADMIN_EMAIL = 'admin@cineplay.com';
export const TEST_ADMIN_PASSWORD = 'admin123';
export const TEST_EDITOR_EMAIL = 'editor@cineplay.com';
export const TEST_EDITOR_PASSWORD = 'editor123';
export const TEST_SUPER_ADMIN_EMAIL = 'super@cineplay.com';
export const TEST_SUPER_ADMIN_PASSWORD = 'super123';

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
    // Remove any stored sessions
    localStorage.removeItem('cineplay-supabase-auth');
    localStorage.removeItem('userSession');
    return await supabase.auth.signOut();
  } catch (error) {
    console.error('Erro ao sair:', error);
    return { error };
  }
};

// Auth helpers for testing without Supabase
export const mockSignIn = async (email: string, password: string) => {
  // First, ensure any previous session is cleared
  await signOut();
  
  // Verificar se estamos usando cliente real do Supabase
  if (supabase) {
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
