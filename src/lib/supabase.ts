
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock Supabase client if credentials are missing
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables - using mock client');
    // Create a mock client that doesn't throw errors when methods are called
    supabase = {
        auth: {
            getUser: async () => ({ data: { user: null }, error: null }),
            signOut: async () => ({ error: null }),
        },
        // Add other commonly used methods as needed
    };
} else {
    // Create actual Supabase client when credentials are available
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Export helper functions for common operations
export const getUser = async () => {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

export const signOut = async () => {
    if (!supabaseUrl || !supabaseAnonKey) return { error: null };
    return await supabase.auth.signOut();
};

export { supabase };
