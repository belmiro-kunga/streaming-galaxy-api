
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Project ID from config
const projectId = 'myvoecxoicxhklaxvgdi';

// If no URL is provided, construct it from the project ID
export const finalSupabaseUrl = supabaseUrl || `https://${projectId}.supabase.co`;

// Create the Supabase client
export const supabase = createClient(
  finalSupabaseUrl, 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15dm9lY3hvaWN4aGtsYXh2Z2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTc3OTIsImV4cCI6MjA1NjY5Mzc5Mn0.XWLoIGayQvzdyQlFi8v9ziM991Xt44uOFT3FL58RkP8',
  {
    auth: {
      persistSession: false, // Changed to false to prevent automatic session persistence
      storageKey: 'cineplay-supabase-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Log connection status
if (!finalSupabaseUrl || !supabaseAnonKey) {
  console.warn('Credenciais do Supabase não encontradas - usando cliente simulado.');
  console.info('Para conectar ao Supabase, defina as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
} else {
  console.log('Cliente Supabase inicializado com sucesso');
  console.log('Conectado a:', finalSupabaseUrl);
  console.log('Usando chave anônima:', supabaseAnonKey.substring(0, 10) + '...');
}
