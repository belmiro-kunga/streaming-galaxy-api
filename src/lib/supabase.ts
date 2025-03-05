
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

// Create a mock Supabase client if credentials are missing
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables - using mock client');
    // Create a more comprehensive mock client that doesn't throw errors when methods are called
    supabase = {
        auth: {
            getUser: async () => ({ data: { user: null }, error: null }),
            signOut: async () => ({ error: null }),
            signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
                // Mock admin authentication for development mode
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
            },
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
