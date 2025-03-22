
import { ContentItem } from '@/types/api/content';

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
    generos: item?.generos || [],
    status: item?.status || 'pendente',
    metadata: item?.metadata || {}
  };
};

// Mock content data
const mockContent: ContentItem[] = [
  {
    id: 'content-1',
    tipo: 'filme',
    titulo: 'Matrix',
    descricao: 'Um hacker descobre a verdade sobre a realidade.',
    ano_lancamento: 1999,
    classificacao_etaria: '14',
    gratuito: true,
    duracao: '2h 16min',
    poster_url: 'https://source.unsplash.com/random/300x450?matrix',
    backdrop_url: 'https://source.unsplash.com/random/1920x1080?matrix',
    generos: ['Ação', 'Ficção Científica'],
    destaque: true,
    status: 'aprovado',
    data_adicao: '2023-01-01T00:00:00.000Z',
    metadata: {
      diretorio: 'Netflix',
      titulo_original: 'The Matrix',
      origem: 'EUA',
      diretor: 'Wachowski',
      elenco: 'Keanu Reeves, Laurence Fishburne'
    }
  },
  {
    id: 'content-2',
    tipo: 'serie',
    titulo: 'Breaking Bad',
    descricao: 'Um professor de química se torna um produtor de drogas.',
    ano_lancamento: 2008,
    classificacao_etaria: '18',
    gratuito: false,
    duracao: '5 temporadas',
    poster_url: 'https://source.unsplash.com/random/300x450?chemistry',
    backdrop_url: 'https://source.unsplash.com/random/1920x1080?desert',
    generos: ['Drama', 'Crime'],
    destaque: true,
    status: 'aprovado',
    data_adicao: '2023-02-01T00:00:00.000Z',
    metadata: {
      diretorio: 'Prime Video',
      titulo_original: 'Breaking Bad',
      origem: 'EUA',
      diretor: 'Vince Gilligan',
      elenco: 'Bryan Cranston, Aaron Paul',
      temporada: 1,
      episodio: 1,
      total_temporadas: 5,
      titulo_episodio: 'Piloto',
      episodios: [
        {
          numero_temporada: 1,
          numero_episodio: 1,
          titulo: 'Piloto',
          duracao: '58min'
        }
      ]
    }
  }
];

// Content API functions
export const contentAPI = {
  getAllContent: async (): Promise<ContentItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockContent];
  },
  
  getContentById: async (id: string): Promise<ContentItem | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const content = mockContent.find(item => item.id === id);
    return content ? { ...content } : null;
  },
  
  saveContent: async (content: Partial<ContentItem>): Promise<ContentItem> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const isNew = !content.id || !mockContent.some(item => item.id === content.id);
    
    const savedContent = validateContentItem({
      ...content,
      id: isNew ? `content-${mockContent.length + 1}` : content.id,
      data_adicao: content.data_adicao || new Date().toISOString()
    });
    
    if (isNew) {
      mockContent.push(savedContent);
    } else {
      const index = mockContent.findIndex(item => item.id === content.id);
      if (index >= 0) {
        mockContent[index] = savedContent;
      }
    }
    
    return savedContent;
  },
  
  deleteContent: async (id: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockContent.findIndex(item => item.id === id);
    if (index >= 0) {
      mockContent.splice(index, 1);
      return true;
    }
    return false;
  },
  
  updateContentStatus: async (id: string, status: string): Promise<ContentItem | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockContent.findIndex(item => item.id === id);
    if (index >= 0) {
      mockContent[index].status = status;
      return { ...mockContent[index] };
    }
    return null;
  },
  
  // Function to handle CSV import
  importContentFromCSV: async (items: ContentItem[]): Promise<{
    success: boolean;
    message: string;
    imported: number;
    total: number;
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let imported = 0;
    
    for (const item of items) {
      const validItem = validateContentItem(item);
      
      // Check if content already exists
      const existingIndex = mockContent.findIndex(
        existing => existing.titulo === validItem.titulo && 
                    existing.tipo === validItem.tipo &&
                    existing.ano_lancamento === validItem.ano_lancamento
      );
      
      if (existingIndex >= 0) {
        // Update existing content
        mockContent[existingIndex] = {
          ...mockContent[existingIndex],
          ...validItem,
          id: mockContent[existingIndex].id // Keep the original ID
        };
      } else {
        // Add new content
        mockContent.push({
          ...validItem,
          id: `content-${mockContent.length + 1}`,
          data_adicao: new Date().toISOString()
        });
      }
      
      imported++;
    }
    
    return {
      success: true,
      message: `Importados ${imported} de ${items.length} itens com sucesso.`,
      imported,
      total: items.length
    };
  }
};
