
import { ContentItem, Genre } from '@/types/api';

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
    video_url: item?.video_url || 'https://www.youtube.com/watch?v=fz0j2lAo4K0'
  };
};

export const contentAPI = {
  getContentById: async (id: string): Promise<ContentItem | null> => {
    return validateContentItem({
      id: id,
      tipo: "filme",
      titulo: "Filme " + id,
      descricao: "Descrição detalhada do filme " + id,
      ano_lancamento: 2024,
      classificacao_etaria: "16",
      gratuito: true,
      duracao: "2h 15min",
      video_url: "https://www.youtube.com/watch?v=fz0j2lAo4K0"
    });
  },

  getFeatureContent: async (): Promise<ContentItem> => {
    return validateContentItem({
      id: "feature-1",
      tipo: "filme",
      titulo: "Aventuras em Angola",
      descricao: "Um filme épico sobre as belezas naturais e culturais de Angola.",
      ano_lancamento: 2023,
      classificacao_etaria: "12",
      gratuito: false
    });
  },

  getTrendingContent: async (limit = 10): Promise<ContentItem[]> => {
    const mockTrending = Array(limit).fill(null).map((_, index) => ({
      id: `trending-${index}`,
      tipo: index % 2 === 0 ? "filme" : "serie",
      titulo: `Título Tendência ${index + 1}`,
      descricao: `Descrição do conteúdo em tendência número ${index + 1}`,
      ano_lancamento: 2020 + (index % 4),
      classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
      gratuito: index % 3 === 0
    }));
    
    return mockTrending.map(validateContentItem);
  },

  getContentByGenre: async (genreId: string, limit = 10): Promise<ContentItem[]> => {
    try {
      const mockContent = Array(limit).fill(null).map((_, index) => ({
        id: `genre-${genreId}-${index}`,
        tipo: index % 2 === 0 ? "filme" : "serie",
        titulo: `${index % 3 === 0 ? 'Filme' : 'Série'} ${genreId} - ${index + 1}`,
        descricao: `Descrição do conteúdo do gênero ${genreId} número ${index + 1}`,
        ano_lancamento: 2019 + (index % 5),
        classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
        gratuito: index % 4 === 0
      }));
      
      return mockContent.map(validateContentItem);
    } catch (error) {
      console.error(`Error in getContentByGenre for genre ${genreId}:`, error);
      return [];
    }
  },

  getAllGenres: async (): Promise<Genre[]> => {
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
  },
  
  getRecentContent: async (limit = 10): Promise<ContentItem[]> => {
    const mockRecent = Array(limit).fill(null).map((_, index) => ({
      id: `recent-${index}`,
      tipo: index % 2 === 0 ? "filme" : "serie",
      titulo: `Lançamento ${index + 1}`,
      descricao: `Novo conteúdo adicionado recentemente número ${index + 1}`,
      ano_lancamento: 2023,
      classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
      gratuito: index % 3 === 0
    }));
    
    return mockRecent.map(validateContentItem);
  },
  
  getTopRatedContent: async (limit = 10): Promise<ContentItem[]> => {
    const mockTopRated = Array(limit).fill(null).map((_, index) => ({
      id: `top-${index}`,
      tipo: index % 2 === 0 ? "filme" : "serie",
      titulo: `Top ${index + 1}`,
      descricao: `Conteúdo melhor avaliado número ${index + 1}`,
      ano_lancamento: 2018 + (index % 6),
      classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
      gratuito: index % 3 === 0
    }));
    
    return mockTopRated.map(validateContentItem);
  }
};
