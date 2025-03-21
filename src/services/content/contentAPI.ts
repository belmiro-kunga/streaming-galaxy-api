
import { ContentItem, Genre, ContentFilterOptions } from '@/types/api';

// Helper function to ensure content items have the correct structure
const validateContentItem = (item: any): ContentItem => {
  return {
    id: item?.id || `mock-${Math.random().toString(36).substr(2, 9)}`,
    tipo: item?.tipo || 'filme',
    titulo: item?.titulo || 'Título não disponível',
    descricao: item?.descricao || 'Descrição não disponível',
    ano_lancamento: item?.ano_lancamento || 2023,
    classificacao_etaria: item?.classificacao_etaria || '16',
    gratuito: item?.gratuito ?? true,
    duracao: item?.duracao || '2h 15min',
    video_url: item?.video_url || '',
    video_url_480p: item?.video_url_480p || '',
    video_url_720p: item?.video_url_720p || '',
    video_url_1080p: item?.video_url_1080p || '',
    poster_url: item?.poster_url || `https://source.unsplash.com/random/300x450?movie,${item?.titulo || 'film'}`,
    backdrop_url: item?.backdrop_url || `https://source.unsplash.com/random/1920x1080?movie,${item?.titulo || 'film'}`,
    trailer_url: item?.trailer_url || '',
    destaque: item?.destaque || false,
    data_adicao: item?.created_at || new Date().toISOString(),
    generos: item?.generos || []
  };
};

export const contentAPI = {
  getContentById: async (id: string): Promise<ContentItem | null> => {
    try {
      const { data, error } = await fetch(`/api/content/${id}`).then(res => res.json());
      
      if (error) {
        console.error('Error fetching content by ID:', error);
        return null;
      }
      
      return validateContentItem(data);
    } catch (error) {
      console.error('Error in getContentById:', error);
      
      // Return mock data for development
      return validateContentItem({
        id: id,
        tipo: "filme",
        titulo: "Filme " + id,
        descricao: "Descrição detalhada do filme " + id,
        ano_lancamento: 2024,
        classificacao_etaria: "16",
        gratuito: true,
        duracao: "2h 15min",
        video_url_480p: "https://www.youtube.com/watch?v=fz0j2lAo4K0",
        video_url_720p: "https://www.youtube.com/watch?v=fz0j2lAo4K0",
        video_url_1080p: "https://www.youtube.com/watch?v=fz0j2lAo4K0"
      });
    }
  },

  getFeatureContent: async (): Promise<ContentItem> => {
    try {
      const { data, error } = await fetch('/api/content/featured').then(res => res.json());
      
      if (error) {
        console.error('Error fetching featured content:', error);
        throw error;
      }
      
      return validateContentItem(data);
    } catch (error) {
      console.error('Error in getFeatureContent:', error);
      
      // Return mock data for development
      return validateContentItem({
        id: "feature-1",
        tipo: "filme",
        titulo: "Aventuras em Angola",
        descricao: "Um filme épico sobre as belezas naturais e culturais de Angola.",
        ano_lancamento: 2023,
        classificacao_etaria: "12",
        gratuito: false,
        destaque: true
      });
    }
  },

  getTrendingContent: async (limit = 10): Promise<ContentItem[]> => {
    try {
      const { data, error } = await fetch(`/api/content/trending?limit=${limit}`).then(res => res.json());
      
      if (error) {
        console.error('Error fetching trending content:', error);
        throw error;
      }
      
      return (data || []).map(validateContentItem);
    } catch (error) {
      console.error('Error in getTrendingContent:', error);
      
      // Return mock data for development
      const mockTrending = Array(limit).fill(null).map((_, index) => ({
        id: `trending-${index}`,
        tipo: index % 2 === 0 ? "filme" : "serie",
        titulo: `Título Tendência ${index + 1}`,
        descricao: `Descrição do conteúdo em tendência número ${index + 1}`,
        ano_lancamento: 2020 + (index % 4),
        classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
        gratuito: index % 3 === 0,
        destaque: index % 5 === 0,
        data_adicao: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      return mockTrending.map(validateContentItem);
    }
  },

  getContentByGenre: async (genreId: string, limit = 10): Promise<ContentItem[]> => {
    try {
      const { data, error } = await fetch(`/api/content/genre/${genreId}?limit=${limit}`).then(res => res.json());
      
      if (error) {
        console.error(`Error fetching content by genre ${genreId}:`, error);
        throw error;
      }
      
      return (data || []).map(validateContentItem);
    } catch (error) {
      console.error(`Error in getContentByGenre for genre ${genreId}:`, error);
      
      // Return mock data for development
      const mockContent = Array(limit).fill(null).map((_, index) => ({
        id: `genre-${genreId}-${index}`,
        tipo: index % 2 === 0 ? "filme" : "serie",
        titulo: `${index % 3 === 0 ? 'Filme' : 'Série'} ${genreId} - ${index + 1}`,
        descricao: `Descrição do conteúdo do gênero ${genreId} número ${index + 1}`,
        ano_lancamento: 2019 + (index % 5),
        classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
        gratuito: index % 4 === 0,
        generos: [genreId]
      }));
      
      return mockContent.map(validateContentItem);
    }
  },

  getAllContent: async (filters?: ContentFilterOptions): Promise<ContentItem[]> => {
    try {
      let url = '/api/content';
      if (filters) {
        const queryParams = new URLSearchParams();
        if (filters.genre) queryParams.append('genre', filters.genre);
        if (filters.year) queryParams.append('year', filters.year.toString());
        if (filters.classification) queryParams.append('classification', filters.classification);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.free !== undefined) queryParams.append('free', filters.free.toString());
        
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }
      
      const { data, error } = await fetch(url).then(res => res.json());
      
      if (error) {
        console.error('Error fetching all content:', error);
        throw error;
      }
      
      return (data || []).map(validateContentItem);
    } catch (error) {
      console.error('Error in getAllContent:', error);
      
      // Return mock data for development
      const mockContent = Array(20).fill(null).map((_, index) => ({
        id: `content-${index}`,
        tipo: index % 2 === 0 ? "filme" : "serie",
        titulo: `Conteúdo ${index + 1}`,
        descricao: `Descrição do conteúdo número ${index + 1}`,
        ano_lancamento: 2018 + (index % 7),
        classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
        gratuito: index % 3 === 0,
        generos: [`${index % 10 + 1}`]
      }));
      
      return mockContent.map(validateContentItem);
    }
  },

  getAllGenres: async (): Promise<Genre[]> => {
    try {
      const { data, error } = await fetch('/api/genres').then(res => res.json());
      
      if (error) {
        console.error('Error fetching genres:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllGenres:', error);
      
      // Return mock data for development
      return [
        { id: "1", nome: "Ação" },
        { id: "2", nome: "Aventura" },
        { id: "3", nome: "Comédia" },
        { id: "4", nome: "Drama" },
        { id: "5", nome: "Terror" },
        { id: "6", nome: "Sci-Fi" },
        { id: "7", nome: "Romance" },
        { id: "8", nome: "Documentário" },
        { id: "9", nome: "Animação" },
        { id: "10", nome: "Musical" }
      ];
    }
  },
  
  getRecentContent: async (limit = 10): Promise<ContentItem[]> => {
    try {
      const { data, error } = await fetch(`/api/content/recent?limit=${limit}`).then(res => res.json());
      
      if (error) {
        console.error('Error fetching recent content:', error);
        throw error;
      }
      
      return (data || []).map(validateContentItem);
    } catch (error) {
      console.error('Error in getRecentContent:', error);
      
      // Return mock data for development
      const mockRecent = Array(limit).fill(null).map((_, index) => ({
        id: `recent-${index}`,
        tipo: index % 2 === 0 ? "filme" : "serie",
        titulo: `Lançamento ${index + 1}`,
        descricao: `Novo conteúdo adicionado recentemente número ${index + 1}`,
        ano_lancamento: 2023,
        classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
        gratuito: index % 3 === 0,
        data_adicao: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      return mockRecent.map(validateContentItem);
    }
  },
  
  getTopRatedContent: async (limit = 10): Promise<ContentItem[]> => {
    try {
      const { data, error } = await fetch(`/api/content/top-rated?limit=${limit}`).then(res => res.json());
      
      if (error) {
        console.error('Error fetching top rated content:', error);
        throw error;
      }
      
      return (data || []).map(validateContentItem);
    } catch (error) {
      console.error('Error in getTopRatedContent:', error);
      
      // Return mock data for development
      const mockTopRated = Array(limit).fill(null).map((_, index) => ({
        id: `top-${index}`,
        tipo: index % 2 === 0 ? "filme" : "serie",
        titulo: `Top ${index + 1}`,
        descricao: `Conteúdo melhor avaliado número ${index + 1}`,
        ano_lancamento: 2018 + (index % 6),
        classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
        gratuito: index % 3 === 0,
        avaliacao: (Math.random() * 2 + 8).toFixed(1)
      }));
      
      return mockTopRated.map(validateContentItem);
    }
  },

  saveContent: async (content: Partial<ContentItem>): Promise<ContentItem> => {
    try {
      const { data, error } = await fetch('/api/content', {
        method: content.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      }).then(res => res.json());
      
      if (error) {
        console.error('Error saving content:', error);
        throw error;
      }
      
      return validateContentItem(data);
    } catch (error) {
      console.error('Error in saveContent:', error);
      
      // Return mock saved content for development
      return validateContentItem({
        ...content,
        id: content.id || `new-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  },

  deleteContent: async (id: string): Promise<boolean> => {
    try {
      const { error } = await fetch(`/api/content/${id}`, {
        method: 'DELETE'
      }).then(res => res.json());
      
      if (error) {
        console.error('Error deleting content:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteContent:', error);
      return false;
    }
  },

  toggleFeatured: async (id: string, featured: boolean): Promise<boolean> => {
    try {
      const { error } = await fetch(`/api/content/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured })
      }).then(res => res.json());
      
      if (error) {
        console.error('Error toggling featured status:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in toggleFeatured:', error);
      return false;
    }
  }
};
