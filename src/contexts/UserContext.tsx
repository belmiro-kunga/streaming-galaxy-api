
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
  // Note: role is stored in user_metadata, not directly in the profile
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
      console.log("UserContext - Refreshing user data");
      
      // Get current user
      const currentUser = await getUser();
      
      if (currentUser) {
        console.log('UserContext - User authenticated:', currentUser);
        console.log('UserContext - User metadata:', currentUser.user_metadata);
        
        setUser(currentUser);
        
        // Try to get profile from localStorage first for immediate display
        const cachedProfile = localStorage.getItem('userProfile');
        if (cachedProfile) {
          try {
            const parsedProfile = JSON.parse(cachedProfile);
            console.log('UserContext - Using cached profile:', parsedProfile);
            setProfile(parsedProfile);
          } catch (e) {
            console.error('UserContext - Error parsing cached profile:', e);
          }
        }
        
        // Then fetch fresh data from the database
        const userProfile = await getUserProfile(currentUser.id);
        if (userProfile) {
          console.log('UserContext - Fetched fresh profile:', userProfile);
          setProfile(userProfile);
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
        } else {
          console.log('UserContext - No profile found for user, using user metadata');
          // If no profile found, use user metadata as profile
          const metadataProfile = {
            id: currentUser.id,
            email: currentUser.email,
            first_name: currentUser.user_metadata?.first_name,
            last_name: currentUser.user_metadata?.last_name,
            phone: currentUser.user_metadata?.phone,
            country: currentUser.user_metadata?.country,
            province: currentUser.user_metadata?.province,
          };
          setProfile(metadataProfile);
          localStorage.setItem('userProfile', JSON.stringify(metadataProfile));
        }
      } else {
        console.log('UserContext - No authenticated user found');
        setUser(null);
        setProfile(null);
        localStorage.removeItem('userProfile');
      }
    } catch (error) {
      console.error('UserContext - Error refreshing user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("UserContext - Logging out user");
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      localStorage.removeItem('userProfile');
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta."
      });
    } catch (error) {
      console.error('UserContext - Error logging out:', error);
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
        console.log('UserContext - Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('UserContext - User signed in or token refreshed, updating user data');
          if (session?.user) {
            console.log('UserContext - New session user metadata:', session.user.user_metadata);
          }
          await refreshUserData();
        } else if (event === 'SIGNED_OUT') {
          console.log('UserContext - User signed out, clearing user data');
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
