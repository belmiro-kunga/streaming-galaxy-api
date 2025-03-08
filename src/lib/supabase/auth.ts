
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

export const getUserProfile = async (userId) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles_view')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao processar perfil do usuário:', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('cineplay-supabase-auth');
    localStorage.removeItem('userSession');
    localStorage.removeItem('userProfile');
    
    return await supabase.auth.signOut();
  } catch (error) {
    console.error('Erro ao sair:', error);
    return { error };
  }
};

// Auth helpers for testing without Supabase
export const mockSignIn = async (email, password) => {
  // First, ensure any previous session is cleared
  await signOut();
  
  // Check if we're using actual Supabase client
  if (supabase.auth) {
    console.log('Usando autenticação real do Supabase');
    
    // For test credentials, use mock auth instead of real Supabase
    if ((email === TEST_ADMIN_EMAIL && password === TEST_ADMIN_PASSWORD) ||
        (email === TEST_EDITOR_EMAIL && password === TEST_EDITOR_PASSWORD) ||
        (email === TEST_SUPER_ADMIN_EMAIL && password === TEST_SUPER_ADMIN_PASSWORD)) {
      console.log('Usando autenticação simulada para credenciais de teste');
      return mockTestCredentials(email, password);
    }
    
    try {
      // Use real authentication for non-test credentials
      const result = await supabase.auth.signInWithPassword({ email, password });
      console.log('Resultado da autenticação:', result.data.user ? 'Sucesso' : 'Falha');
      
      // If login was successful, fetch and store the user profile
      if (result.data.user) {
        const userProfile = await getUserProfile(result.data.user.id);
        if (userProfile) {
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
          console.log('Perfil do usuário armazenado:', userProfile);
        }
      }
      
      return result;
    } catch (err) {
      console.error('Erro na autenticação com Supabase:', err);
      return {
        data: { user: null },
        error: err instanceof Error ? err : new Error("Erro na autenticação")
      };
    }
  }
  
  console.log('Usando autenticação simulada para todas as credenciais');
  return mockTestCredentials(email, password);
};

// Helper function to create mock auth responses for test credentials
const mockTestCredentials = (email, password) => {
  if (email === TEST_ADMIN_EMAIL && password === TEST_ADMIN_PASSWORD) {
    const userData = {
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
    };
    
    const profileData = {
      id: '1',
      email: TEST_ADMIN_EMAIL,
      first_name: 'Admin',
      last_name: 'User',
      phone: '123456789',
      country: 'Angola',
      province: 'Luanda',
      role: 'admin'
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    return {
      data: { user: userData },
      error: null
    };
  } else if (email === TEST_EDITOR_EMAIL && password === TEST_EDITOR_PASSWORD) {
    const userData = {
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
    };
    
    const profileData = {
      id: '2',
      email: TEST_EDITOR_EMAIL,
      first_name: 'Editor',
      last_name: 'User',
      phone: '987654321',
      country: 'Angola',
      province: 'Benguela',
      role: 'editor'
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    return {
      data: { user: userData },
      error: null
    };
  } else if (email === TEST_SUPER_ADMIN_EMAIL && password === TEST_SUPER_ADMIN_PASSWORD) {
    const userData = {
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
    };
    
    const profileData = {
      id: '3',
      email: TEST_SUPER_ADMIN_EMAIL,
      first_name: 'Super',
      last_name: 'Admin',
      phone: '555555555',
      country: 'Angola',
      province: 'Huambo',
      role: 'super_admin'
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    return {
      data: { user: userData },
      error: null
    };
  } else {
    return {
      data: { user: null },
      error: new Error("Credenciais inválidas")
    };
  }
};
