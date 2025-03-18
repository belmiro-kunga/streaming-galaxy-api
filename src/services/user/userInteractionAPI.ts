
import { ContentItem } from '@/types/api';
import { contentAPI } from '../content/contentAPI';

export const userInteractionAPI = {
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
        ...contentAPI['validateContentItem'](item),
        percentual_assistido: item.percentual_assistido
      })) as ContentItem[];
    } catch (error) {
      console.error('Error fetching continue watching content:', error);
      return [];
    }
  },
  
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
      
      return mockRecommended.map(contentAPI['validateContentItem']);
    } catch (error) {
      console.error('Error fetching recommended content:', error);
      return [];
    }
  }
};
