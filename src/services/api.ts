
import axios from 'axios';
import { supabase } from '@/lib/supabase';

// API base configuration
const api = axios.create({
  baseURL: '/api',
});

// Authentication APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  register: async (email: string, password: string, nome: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        },
      },
    });
    
    if (authError) throw authError;
    
    // Create user profile after registration
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('perfis_usuario')
        .insert({
          id: authData.user.id,
          nome,
          fuso_horario: 'Africa/Luanda',
          idioma_preferido: 'pt-AO',
          perfil: 'usuario',
        });
      
      if (profileError) throw profileError;
    }
    
    return authData;
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },
  
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  },
  
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
};

// User profile APIs
export const profileAPI = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('perfis_usuario')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  updateProfile: async (userId: string, profileData: any) => {
    const { data, error } = await supabase
      .from('perfis_usuario')
      .update(profileData)
      .eq('id', userId)
      .select();
      
    if (error) throw error;
    return data;
  },
};

// Content APIs
export const contentAPI = {
  getFeatureContent: async () => {
    const { data, error } = await supabase
      .from('conteudos')
      .select(`
        *,
        generos:conteudo_generos(genero:generos(*))
      `)
      .eq('status', 'ativo')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  getTrendingContent: async (limit = 10) => {
    const { data, error } = await supabase
      .from('conteudos')
      .select(`
        *,
        generos:conteudo_generos(genero:generos(*))
      `)
      .eq('status', 'ativo')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data || [];
  },
  
  getContentByGenre: async (genreId: string, limit = 10) => {
    const { data, error } = await supabase
      .from('conteudo_generos')
      .select(`
        conteudo:conteudos(*)
      `)
      .eq('genero_id', genreId)
      .limit(limit);
      
    if (error) throw error;
    return data?.map(item => item.conteudo) || [];
  },
  
  getContentById: async (contentId: string) => {
    const { data, error } = await supabase
      .from('conteudos')
      .select(`
        *,
        generos:conteudo_generos(genero:generos(*)),
        episodios(*)
      `)
      .eq('id', contentId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  searchContent: async (query: string) => {
    const { data, error } = await supabase
      .from('conteudos')
      .select(`
        *,
        generos:conteudo_generos(genero:generos(*))
      `)
      .or(`titulo.ilike.%${query}%, descricao.ilike.%${query}%`)
      .eq('status', 'ativo');
      
    if (error) throw error;
    return data || [];
  },
  
  getAllGenres: async () => {
    const { data, error } = await supabase
      .from('generos')
      .select('*')
      .order('nome');
      
    if (error) throw error;
    return data || [];
  },
};

// Subscription APIs
export const subscriptionAPI = {
  getPlans: async () => {
    const { data, error } = await supabase
      .from('planos_assinatura')
      .select(`
        *,
        precos:precos_planos(*)
      `)
      .eq('ativo', true);
      
    if (error) throw error;
    return data || [];
  },
  
  getUserSubscription: async (userId: string) => {
    const { data, error } = await supabase
      .from('assinaturas_usuario')
      .select(`
        *,
        plano:planos_assinatura(*)
      `)
      .eq('usuario_id', userId)
      .eq('status', 'ativa')
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  
  subscribe: async (userId: string, planId: string, moedaCodigo: string) => {
    // Get current date and add 30 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    
    const { data, error } = await supabase
      .from('assinaturas_usuario')
      .insert({
        usuario_id: userId,
        plano_id: planId,
        moeda_codigo: moedaCodigo,
        data_inicio: startDate.toISOString().split('T')[0],
        data_fim: endDate.toISOString().split('T')[0],
        status: 'ativa',
      })
      .select();
      
    if (error) throw error;
    return data;
  },
};

// User interaction APIs
export const userInteractionAPI = {
  addToFavorites: async (userId: string, contentId: string) => {
    const { data, error } = await supabase
      .from('favoritos')
      .insert({
        usuario_id: userId,
        conteudo_id: contentId,
      })
      .select();
      
    if (error) throw error;
    return data;
  },
  
  removeFromFavorites: async (userId: string, contentId: string) => {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', userId)
      .eq('conteudo_id', contentId);
      
    if (error) throw error;
    return true;
  },
  
  getFavorites: async (userId: string) => {
    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        conteudo:conteudos(*)
      `)
      .eq('usuario_id', userId);
      
    if (error) throw error;
    return data?.map(item => item.conteudo) || [];
  },
  
  updateWatchHistory: async (userId: string, contentId: string, episodeId: string | null, position: number, percentage: number) => {
    // Check if entry exists
    const { data: existingData } = await supabase
      .from('historico_reproducao')
      .select('id')
      .eq('usuario_id', userId)
      .eq(episodeId ? 'episodio_id' : 'conteudo_id', episodeId || contentId)
      .maybeSingle();
      
    if (existingData) {
      // Update existing entry
      const { data, error } = await supabase
        .from('historico_reproducao')
        .update({
          posicao_tempo: position,
          percentual_assistido: percentage,
        })
        .eq('id', existingData.id)
        .select();
        
      if (error) throw error;
      return data;
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from('historico_reproducao')
        .insert({
          usuario_id: userId,
          conteudo_id: episodeId ? null : contentId,
          episodio_id: episodeId,
          posicao_tempo: position,
          percentual_assistido: percentage,
        })
        .select();
        
      if (error) throw error;
      return data;
    }
  },
  
  getContinueWatching: async (userId: string) => {
    const { data, error } = await supabase
      .from('historico_reproducao')
      .select(`
        id,
        posicao_tempo,
        percentual_assistido,
        conteudo:conteudos(*),
        episodio:episodios(*)
      `)
      .eq('usuario_id', userId)
      .lt('percentual_assistido', 95)
      .order('updated_at', { ascending: false })
      .limit(10);
      
    if (error) throw error;
    return data || [];
  },
};

// Device and Download APIs
export const deviceAPI = {
  registerDevice: async (userId: string, deviceType: string, deviceId: string, metadata: any = {}) => {
    const { data, error } = await supabase
      .from('dispositivos')
      .insert({
        usuario_id: userId,
        tipo: deviceType,
        identificador: deviceId,
        metadata,
        ultimo_acesso: new Date().toISOString(),
      })
      .select();
      
    if (error) throw error;
    return data;
  },
  
  updateDeviceAccess: async (deviceId: string) => {
    const { data, error } = await supabase
      .from('dispositivos')
      .update({
        ultimo_acesso: new Date().toISOString(),
      })
      .eq('id', deviceId)
      .select();
      
    if (error) throw error;
    return data;
  },
  
  getUserDevices: async (userId: string) => {
    const { data, error } = await supabase
      .from('dispositivos')
      .select('*')
      .eq('usuario_id', userId);
      
    if (error) throw error;
    return data || [];
  },
};

export const downloadAPI = {
  createDownload: async (userId: string, mediaFileId: string, deviceId: string) => {
    // Set expiration to 48 hours from now
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 48);
    
    const { data, error } = await supabase
      .from('downloads')
      .insert({
        usuario_id: userId,
        arquivo_midia_id: mediaFileId,
        dispositivo_id: deviceId,
        status: 'completo',
        data_expiracao: expirationDate.toISOString(),
      })
      .select();
      
    if (error) throw error;
    
    // Update downloads count in user subscription
    await supabase.rpc('incrementar_downloads_utilizados', {
      p_usuario_id: userId
    });
    
    return data;
  },
  
  getUserDownloads: async (userId: string) => {
    const { data, error } = await supabase
      .from('downloads')
      .select(`
        *,
        arquivo:arquivos_midia(*),
        dispositivo:dispositivos(*)
      `)
      .eq('usuario_id', userId)
      .eq('status', 'completo')
      .gt('data_expiracao', new Date().toISOString());
      
    if (error) throw error;
    return data || [];
  },
  
  deleteDownload: async (downloadId: string) => {
    const { error } = await supabase
      .from('downloads')
      .update({
        status: 'removido'
      })
      .eq('id', downloadId);
      
    if (error) throw error;
    return true;
  },
};

export default api;
