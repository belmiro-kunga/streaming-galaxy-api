
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
  },
  
  // Get recently added content
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
  
  // Get top rated content
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

// User interaction API mock
export const userInteractionAPI = {
  // Get continue watching content
  getContinueWatching: async (userId: string): Promise<ContentItem[]> => {
    try {
      const mockWatching = Array(5).fill(null).map((_, index) => ({
        id: `continue-${index}`,
        tipo: index % 2 === 0 ? "filme" : "serie",
        titulo: `Continuar assistindo ${index + 1}`,
        descricao: `Você parou de assistir aqui`,
        ano_lancamento: 2021 + (index % 3),
        classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
        gratuito: index % 3 === 0,
        percentual_assistido: Math.floor(Math.random() * 80) + 10
      }));
      
      return mockWatching.map(item => ({
        ...validateContentItem(item),
        percentual_assistido: item.percentual_assistido
      })) as ContentItem[];
    } catch (error) {
      console.error('Error fetching continue watching content:', error);
      return [];
    }
  },
  
  // Get recommended for you
  getRecommendedContent: async (userId: string): Promise<ContentItem[]> => {
    try {
      const mockRecommended = Array(10).fill(null).map((_, index) => ({
        id: `recommended-${index}`,
        tipo: index % 2 === 0 ? "filme" : "serie",
        titulo: `Recomendado para você ${index + 1}`,
        descricao: `Baseado no que você assistiu`,
        ano_lancamento: 2020 + (index % 4),
        classificacao_etaria: ["L", "10", "12", "14", "16", "18"][index % 6],
        gratuito: index % 3 === 0
      }));
      
      return mockRecommended.map(validateContentItem);
    } catch (error) {
      console.error('Error fetching recommended content:', error);
      return [];
    }
  }
};
