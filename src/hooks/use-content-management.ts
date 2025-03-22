
import { useState, useEffect } from 'react';
import { contentAPI } from '@/services/content/contentAPI';
import { ContentItem, Genre, ContentFilterOptions } from '@/types/api';

export const useContentFetch = (type?: 'all' | 'trending' | 'recent' | 'top-rated', genreId?: string, limit: number = 10) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        let data: ContentItem[] = [];
        
        if (genreId) {
          data = await contentAPI.getContentByGenre(genreId, limit);
        } else {
          switch (type) {
            case 'trending':
              data = await contentAPI.getTrendingContent(limit);
              break;
            case 'recent':
              data = await contentAPI.getRecentContent(limit);
              break;
            case 'top-rated':
              data = await contentAPI.getTopRatedContent(limit);
              break;
            case 'all':
            default:
              data = await contentAPI.getAllContent();
              break;
          }
        }
        
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar conteúdo'));
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [type, genreId, limit]);

  return { content, loading, error };
};

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const data = await contentAPI.getAllGenres();
        setGenres(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar gêneros'));
        console.error('Error fetching genres:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGenres();
  }, []);
  
  return { genres, loading, error };
};

export const useContentDetail = (contentId: string) => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<'480p' | '720p' | '1080p' | 'auto'>('auto');
  
  useEffect(() => {
    const fetchContentDetail = async () => {
      try {
        setLoading(true);
        const data = await contentAPI.getContentById(contentId);
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar detalhes do conteúdo'));
        console.error('Error fetching content detail:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (contentId) {
      fetchContentDetail();
    }
  }, [contentId]);

  // Get video URL based on selected quality
  const getVideoUrl = () => {
    if (!content) return '';
    
    switch (selectedQuality) {
      case '480p':
        return content.video_url_480p || content.video_url || '';
      case '720p':
        return content.video_url_720p || content.video_url || '';
      case '1080p':
        return content.video_url_1080p || content.video_url || '';
      case 'auto':
      default:
        // Auto: use highest quality available, fallback to lower ones
        return content.video_url_1080p || content.video_url_720p || content.video_url_480p || content.video_url || '';
    }
  };

  // Handle quality change
  const handleQualityChange = (quality: '480p' | '720p' | '1080p' | 'auto') => {
    setSelectedQuality(quality);
  };
  
  return { 
    content, 
    loading, 
    error, 
    selectedQuality, 
    videoUrl: getVideoUrl(), 
    handleQualityChange 
  };
};

export const useContentFilter = () => {
  const [filters, setFilters] = useState<ContentFilterOptions>({});
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchFilteredContent = async () => {
      try {
        setLoading(true);
        const data = await contentAPI.getAllContent(filters);
        setFilteredContent(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao filtrar conteúdo'));
        console.error('Error filtering content:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilteredContent();
  }, [filters]);
  
  // Update filters
  const updateFilters = (newFilters: Partial<ContentFilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({});
  };
  
  return { 
    filters, 
    filteredContent, 
    loading, 
    error, 
    updateFilters, 
    resetFilters 
  };
};

export const useContentManagement = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await contentAPI.getAllContent();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar conteúdo'));
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchContent();
  }, []);
  
  const saveContent = async (contentData: Partial<ContentItem>) => {
    try {
      setLoading(true);
      await contentAPI.saveContent(contentData);
      // Refresh content list
      await fetchContent();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao salvar conteúdo'));
      console.error('Error saving content:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteContent = async (contentId: string) => {
    try {
      setLoading(true);
      await contentAPI.deleteContent(contentId);
      // Refresh content list
      await fetchContent();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao deletar conteúdo'));
      console.error('Error deleting content:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const toggleFeatured = async (contentId: string, featured: boolean) => {
    try {
      setLoading(true);
      await contentAPI.toggleFeatured(contentId, featured);
      // Refresh content list
      await fetchContent();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar destaque'));
      console.error('Error toggling featured:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const updateContentStatus = async (contentId: string, status: 'pendente' | 'aprovado' | 'rejeitado') => {
    try {
      setLoading(true);
      
      const contentItem = content.find(item => item.id === contentId);
      if (!contentItem) {
        throw new Error('Conteúdo não encontrado');
      }
      
      await contentAPI.saveContent({
        ...contentItem,
        status
      });
      
      // Refresh content list
      await fetchContent();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar status'));
      console.error('Error updating content status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { 
    content, 
    loading, 
    error, 
    fetchContent, 
    saveContent, 
    deleteContent, 
    toggleFeatured,
    updateContentStatus
  };
};
