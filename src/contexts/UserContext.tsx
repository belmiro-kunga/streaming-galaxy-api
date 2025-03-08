
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUser, getUserProfile } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  country?: string;
  province?: string;
  created_at?: string;
}

interface UserContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUserData: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  refreshUserData: async () => {},
  logout: async () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = await getUser();
      setUser(currentUser);
      
      if (currentUser) {
        // Try to get profile from localStorage first for immediate display
        const cachedProfile = localStorage.getItem('userProfile');
        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile));
        }
        
        // Then fetch fresh data from the database
        const userProfile = await getUserProfile(currentUser.id);
        if (userProfile) {
          setProfile(userProfile);
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      localStorage.removeItem('userProfile');
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta."
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar sair da sua conta.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // Initial load
    refreshUserData();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          refreshUserData();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('userProfile');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isAuthenticated,
      refreshUserData,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};
