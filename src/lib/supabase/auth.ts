
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
    // Remove any stored sessions
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
  
  // Verificar se estamos usando cliente real do Supabase
  if (supabase) {
    console.log('Usando autenticação real do Supabase');
    try {
      // For passwordless login, we'll check if we should use the passwordless flow
      if (password === 'no-password-required') {
        // Handling mock passwordless login for development
        if (email === TEST_ADMIN_EMAIL) {
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
            province: 'Luanda'
          };
          
          localStorage.setItem('userProfile', JSON.stringify(profileData));
          
          return {
            data: { user: userData },
            error: null
          };
        } else if (email === TEST_EDITOR_EMAIL) {
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
            province: 'Benguela'
          };
          
          localStorage.setItem('userProfile', JSON.stringify(profileData));
          
          return {
            data: { user: userData },
            error: null
          };
        } else if (email === TEST_SUPER_ADMIN_EMAIL) {
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
            province: 'Huambo'
          };
          
          localStorage.setItem('userProfile', JSON.stringify(profileData));
          
          return {
            data: { user: userData },
            error: null
          };
        } else {
          // Default user role for any email
          const userData = {
            id: '4',
            email: email,
            user_metadata: { 
              role: 'user',
              first_name: 'Regular',
              last_name: 'User',
              phone: '111222333',
              country: 'Angola',
              province: 'Default'
            }
          };
          
          const profileData = {
            id: '4',
            email: email,
            first_name: 'Regular',
            last_name: 'User',
            phone: '111222333',
            country: 'Angola',
            province: 'Default'
          };
          
          localStorage.setItem('userProfile', JSON.stringify(profileData));
          
          return {
            data: { user: userData },
            error: null
          };
        }
      } else {
        // Usar autenticação real com senha
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
      }
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
  if (email === TEST_ADMIN_EMAIL && (password === TEST_ADMIN_PASSWORD || password === 'no-password-required')) {
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
      province: 'Luanda'
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    return {
      data: { user: userData },
      error: null
    };
  } else if (email === TEST_EDITOR_EMAIL && (password === TEST_EDITOR_PASSWORD || password === 'no-password-required')) {
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
      province: 'Benguela'
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    return {
      data: { user: userData },
      error: null
    };
  } else if (email === TEST_SUPER_ADMIN_EMAIL && (password === TEST_SUPER_ADMIN_PASSWORD || password === 'no-password-required')) {
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
      province: 'Huambo'
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    return {
      data: { user: userData },
      error: null
    };
  } else if (password === 'no-password-required') {
    // Allow any email to login as a regular user if passwordless login is used
    const userData = {
      id: '4',
      email: email,
      user_metadata: { 
        role: 'user',
        first_name: 'Regular',
        last_name: 'User',
        phone: '111222333',
        country: 'Angola',
        province: 'Default'
      }
    };
    
    const profileData = {
      id: '4',
      email: email,
      first_name: 'Regular',
      last_name: 'User',
      phone: '111222333',
      country: 'Angola',
      province: 'Default'
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
