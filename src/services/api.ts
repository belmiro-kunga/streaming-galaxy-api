
// Mock implementation for the API
// Replace this with actual API calls in production

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
  };
};

// Content API mock
export const contentAPI = {
  // Get featured content for homepage
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

  // Get trending content
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

  // Get content by genre
  getContentByGenre: async (genreId: string, limit = 10): Promise<ContentItem[]> => {
    const mockContent = Array(limit).fill(null).map((_, index) => ({
      id: `genre-${genreId}-${index}`,
      tipo: index % 2 === 0 ? "filme" : "serie",
      titulo: `Título Gênero ${genreId} - ${index + 1}`,
      descricao: `Descrição do conteúdo do gênero ${genreId} número ${index + 1}`,
      ano_lancamento: 2019 + (index % 5),
      classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
      gratuito: index % 4 === 0
    }));
    
    return mockContent.map(validateContentItem);
  },

  // Get all genres
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
  }
};

// User interaction API mock
export const userInteractionAPI = {
  // Get continue watching content
  getContinueWatching: async (userId: string) => {
    return []; // Return empty array for now
  }
};
