
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

// Types for authentication
type SignUpData = {
  email: string;
  password: string;
  name?: string;
};

type UserProfile = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar_url?: string;
};

// Authentication API service
export const authAPI = {
  // Get current session
  getCurrentSession: async (): Promise<Session | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // Sign up with email and password
  signUp: async (userData: SignUpData): Promise<{ user: User | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name || '',
          },
        },
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<{ user: User | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { user: null, error };
    }
  },

  // Admin login
  adminSignIn: async (email: string, password: string): Promise<{ user: User | null; role: string | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;
      const userRole = user?.user_metadata?.role || 'user';

      // Check if user has admin role
      if (!['admin', 'editor', 'super_admin'].includes(userRole)) {
        await supabase.auth.signOut();
        throw new Error("Você não tem permissão para acessar esta área.");
      }

      return { user, role: userRole, error: null };
    } catch (error: any) {
      console.error('Admin login error:', error);
      return { user: null, role: null, error };
    }
  },

  // Sign in with social provider
  signInWithSocialProvider: async (provider: 'facebook' | 'google'): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error(`Sign in with ${provider} error:`, error);
      return { error };
    }
  },

  // Sign out
  signOut: async (): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error };
    }
  },

  // Reset password
  resetPassword: async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error };
    }
  },

  // Update user profile
  updateProfile: async (profile: Partial<UserProfile>): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: profile,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { error };
    }
  },

  // Check if user has admin role
  isAdmin: async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user) return false;
      
      const userRole = user.user_metadata?.role;
      return ['admin', 'editor', 'super_admin'].includes(userRole);
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
  }
};
