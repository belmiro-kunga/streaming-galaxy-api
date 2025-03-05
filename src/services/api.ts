
import { supabase } from '../lib/supabase';
import type { 
  ApiResponse, 
  Content, 
  UserProfile, 
  SubscriptionPlan, 
  UserSubscription, 
  Episode,
  Favorite,
  Download,
  PlaybackHistory,
  PaginatedResponse,
  Genre,
  Device,
  UserStatistics
} from '../types/api';

// Helper function to format responses in a consistent way
const formatResponse = <T>(data: T, error: any = null): ApiResponse<T> => {
  if (error) {
    return {
      success: false,
      data: null,
      error: {
        message: error.message || 'Ocorreu um erro',
        details: error.details || null
      }
    };
  }
  return {
    success: true,
    data,
    error: null
  };
};

// User Profiles
export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return formatResponse(null, { message: 'Usuário não autenticado' });
    }

    const { data, error } = await supabase
      .from('perfis_usuario')
      .select('*')
      .eq('id', user.data.user.id)
      .single();
    
    if (error) throw error;
    
    return formatResponse({
      id: data.id,
      name: data.nome,
      timezone: data.fuso_horario,
      preferredLanguage: data.idioma_preferido,
      profileType: data.perfil,
      createdAt: data.created_at
    });
  } catch (error: any) {
    return formatResponse(null, error);
  }
};

export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return formatResponse(null, { message: 'Usuário não autenticado' });
    }

    const { data, error } = await supabase
      .from('perfis_usuario')
      .update({
        nome: profile.name,
        fuso_horario: profile.timezone,
        idioma_preferido: profile.preferredLanguage
      })
      .eq('id', user.data.user.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return formatResponse({
      id: data.id,
      name: data.nome,
      timezone: data.fuso_horario,
      preferredLanguage: data.idioma_preferido,
      profileType: data.perfil,
      createdAt: data.created_at
    });
  } catch (error: any) {
    return formatResponse(null, error);
  }
};

// Subscription Plans
export const getSubscriptionPlans = async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
  try {
    const { data, error } = await supabase
      .from('planos_assinatura')
      .select(`
        *,
        precos_planos(*)
      `)
      .eq('ativo', true);
    
    if (error) throw error;
    
    const plans = data.map(plan => ({
      id: plan.id,
      name: plan.nome,
      description: plan.descricao || '',
      maxQuality: plan.qualidade_maxima || 'HD',
      simultaneousScreens: plan.telas_simultaneas,
      downloadLimit: plan.limite_downloads,
      billingCycle: plan.ciclo_cobranca,
      isActive: plan.ativo,
      prices: plan.precos_planos.map((price: any) => ({
        currencyCode: price.moeda_codigo,
        amount: price.preco
      }))
    }));
    
    return formatResponse(plans);
  } catch (error: any) {
    return formatResponse([], error);
  }
};

export const getUserSubscription = async (): Promise<ApiResponse<UserSubscription>> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return formatResponse(null, { message: 'Usuário não autenticado' });
    }

    const { data, error } = await supabase
      .from('assinaturas_usuario')
      .select(`
        *,
        planos_assinatura(*)
      `)
      .eq('usuario_id', user.data.user.id)
      .eq('status', 'ativa')
      .maybeSingle();
    
    if (error) throw error;
    if (!data) {
      return formatResponse(null, { message: 'Nenhuma assinatura ativa encontrada' });
    }
    
    return formatResponse({
      id: data.id,
      userId: data.usuario_id,
      planId: data.plano_id,
      currencyCode: data.moeda_codigo,
      startDate: data.data_inicio,
      endDate: data.data_fim,
      status: data.status,
      downloadsUsed: data.downloads_utilizados,
      plan: {
        id: data.planos_assinatura.id,
        name: data.planos_assinatura.nome,
        description: data.planos_assinatura.descricao || '',
        maxQuality: data.planos_assinatura.qualidade_maxima || 'HD',
        simultaneousScreens: data.planos_assinatura.telas_simultaneas,
        downloadLimit: data.planos_assinatura.limite_downloads,
        billingCycle: data.planos_assinatura.ciclo_cobranca,
        isActive: data.planos_assinatura.ativo,
        prices: []
      }
    });
  } catch (error: any) {
    return formatResponse(null, error);
  }
};

// Content
export const getContents = async (params?: { 
  page?: number; 
  pageSize?: number; 
  tipo?: string;
  genero?: string;
  query?: string;
}): Promise<ApiResponse<PaginatedResponse<Content>>> => {
  try {
    let query = supabase
      .from('conteudos')
      .select(`
        *,
        generos:conteudo_generos(genero_id(id, nome))
      `, { count: 'exact' });
    
    // Apply filters
    if (params?.tipo) {
      query = query.eq('tipo', params.tipo);
    }
    
    if (params?.query) {
      query = query.ilike('titulo', `%${params.query}%`);
    }
    
    // Pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // Process results
    const contents = data.map(item => {
      const genreIds = item.generos.map((g: any) => g.genero_id);
      
      return {
        id: item.id,
        type: item.tipo,
        title: item.titulo,
        description: item.descricao || '',
        releaseYear: item.ano_lancamento,
        duration: item.duracao,
        ageRating: item.classificacao_etaria,
        status: item.status,
        isFree: item.gratuito,
        metadata: item.metadata,
        genres: genreIds
      };
    });
    
    return formatResponse({
      items: contents,
      totalCount: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    });
  } catch (error: any) {
    return formatResponse({
      items: [],
      totalCount: 0,
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      totalPages: 0
    }, error);
  }
};

export const getContentById = async (id: string): Promise<ApiResponse<Content>> => {
  try {
    const { data, error } = await supabase
      .from('conteudos')
      .select(`
        *,
        generos:conteudo_generos(genero_id(id, nome))
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    const genreIds = data.generos.map((g: any) => g.genero_id);
    
    const content = {
      id: data.id,
      type: data.tipo,
      title: data.titulo,
      description: data.descricao || '',
      releaseYear: data.ano_lancamento,
      duration: data.duracao,
      ageRating: data.classificacao_etaria,
      status: data.status,
      isFree: data.gratuito,
      metadata: data.metadata,
      genres: genreIds
    };
    
    return formatResponse(content);
  } catch (error: any) {
    return formatResponse(null, error);
  }
};

export const getFeaturedContent = async (): Promise<ApiResponse<Content[]>> => {
  try {
    const { data, error } = await supabase
      .from('conteudos')
      .select(`
        *,
        generos:conteudo_generos(genero_id(id, nome))
      `)
      .eq('status', 'publicado')
      .limit(6);
    
    if (error) throw error;
    
    const contents = data.map(item => {
      const genreIds = item.generos.map((g: any) => g.genero_id);
      
      return {
        id: item.id,
        type: item.tipo,
        title: item.titulo,
        description: item.descricao || '',
        releaseYear: item.ano_lancamento,
        duration: item.duracao,
        ageRating: item.classificacao_etaria,
        status: item.status,
        isFree: item.gratuito,
        metadata: item.metadata,
        genres: genreIds
      };
    });
    
    return formatResponse(contents);
  } catch (error: any) {
    return formatResponse([], error);
  }
};

// Episodes
export const getEpisodesByContentId = async (contentId: string): Promise<ApiResponse<Episode[]>> => {
  try {
    const { data, error } = await supabase
      .from('episodios')
      .select('*')
      .eq('conteudo_id', contentId)
      .order('numero_temporada', { ascending: true })
      .order('numero_episodio', { ascending: true });
    
    if (error) throw error;
    
    const episodes = data.map(episode => ({
      id: episode.id,
      contentId: episode.conteudo_id,
      seasonNumber: episode.numero_temporada,
      episodeNumber: episode.numero_episodio,
      title: episode.titulo,
      description: episode.descricao || '',
      duration: episode.duracao,
      releaseDate: episode.data_estreia,
      metadata: episode.metadata
    }));
    
    return formatResponse(episodes);
  } catch (error: any) {
    return formatResponse([], error);
  }
};

// User Interactions
export const addFavorite = async (contentId: string): Promise<ApiResponse<Favorite>> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return formatResponse(null, { message: 'Usuário não autenticado' });
    }

    const { data, error } = await supabase
      .from('favoritos')
      .insert({
        usuario_id: user.data.user.id,
        conteudo_id: contentId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return formatResponse({
      userId: data.usuario_id,
      contentId: data.conteudo_id,
      createdAt: data.created_at
    });
  } catch (error: any) {
    return formatResponse(null, error);
  }
};

export const removeFavorite = async (contentId: string): Promise<ApiResponse<void>> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return formatResponse(null, { message: 'Usuário não autenticado' });
    }

    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', user.data.user.id)
      .eq('conteudo_id', contentId);
    
    if (error) throw error;
    
    return formatResponse(null);
  } catch (error: any) {
    return formatResponse(null, error);
  }
};

export const getFavorites = async (): Promise<ApiResponse<Content[]>> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return formatResponse([], { message: 'Usuário não autenticado' });
    }

    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        conteudo:conteudo_id(
          *,
          generos:conteudo_generos(genero_id(id, nome))
        )
      `)
      .eq('usuario_id', user.data.user.id);
    
    if (error) throw error;
    
    const contents = data.map(item => {
      const content = item.conteudo;
      const genreIds = content.generos.map((g: any) => g.genero_id);
      
      return {
        id: content.id,
        type: content.tipo,
        title: content.titulo,
        description: content.descricao || '',
        releaseYear: content.ano_lancamento,
        duration: content.duracao,
        ageRating: content.classificacao_etaria,
        status: content.status,
        isFree: content.gratuito,
        metadata: content.metadata,
        genres: genreIds
      };
    });
    
    return formatResponse(contents);
  } catch (error: any) {
    return formatResponse([], error);
  }
};

export const updatePlaybackProgress = async (
  data: { conteudo_id?: string; episodio_id?: string; posicao_tempo: number; percentual_assistido?: number }
): Promise<ApiResponse<PlaybackHistory>> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return formatResponse(null, { message: 'Usuário não autenticado' });
    }

    // Check if record exists
    const { data: existingData, error: queryError } = await supabase
      .from('historico_reproducao')
      .select('id')
      .eq('usuario_id', user.data.user.id)
      .eq(data.conteudo_id ? 'conteudo_id' : 'episodio_id', data.conteudo_id || data.episodio_id)
      .maybeSingle();
    
    if (queryError) throw queryError;
    
    let result;
    
    if (existingData) {
      // Update existing record
      const { data: updatedData, error } = await supabase
        .from('historico_reproducao')
        .update({
          posicao_tempo: data.posicao_tempo,
          percentual_assistido: data.percentual_assistido
        })
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) throw error;
      result = updatedData;
    } else {
      // Create new record
      const { data: newData, error } = await supabase
        .from('historico_reproducao')
        .insert({
          usuario_id: user.data.user.id,
          conteudo_id: data.conteudo_id || null,
          episodio_id: data.episodio_id || null,
          posicao_tempo: data.posicao_tempo,
          percentual_assistido: data.percentual_assistido
        })
        .select()
        .single();
      
      if (error) throw error;
      result = newData;
    }
    
    return formatResponse({
      id: result.id,
      userId: result.usuario_id,
      contentId: result.conteudo_id,
      episodeId: result.episodio_id,
      position: result.posicao_tempo,
      percentWatched: result.percentual_assistido,
      updatedAt: result.updated_at
    });
  } catch (error: any) {
    return formatResponse(null, error);
  }
};

// Add other methods as needed for your application

// Install necessary dependency
<lov-add-dependency>@supabase/supabase-js@latest</lov-add-dependency>
