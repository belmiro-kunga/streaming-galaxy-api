
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUser, getUserProfile } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';

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
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshUserData: async () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <UserContext.Provider value={{ user, profile, loading, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};
