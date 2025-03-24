
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContentDetail } from '@/hooks/use-content-management';
import { VideoContentDisplay } from '@/components/ui/VideoContentDisplay';
import { contentAPI } from '@/services/content/contentAPI';
import { ContentItem } from '@/types/api';
import { ArrowLeft, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);

  // Get content details
  const { 
    content, 
    loading, 
    error
  } = useContentDetail(id || '');

  // Fetch related content
  useEffect(() => {
    const fetchRelatedContent = async () => {
      if (!content) return;

      try {
        setIsLoadingRelated(true);
        // Get content with similar genre
        const genre = content.generos && content.generos[0];
        let related: ContentItem[] = [];
        
        if (genre) {
          // If genre is a string, find its ID
          const genreId = typeof genre === 'string' 
            ? (await contentAPI.getAllGenres()).find(g => g.nome === genre)?.id
            : genre.id;
            
          if (genreId) {
            related = await contentAPI.getContentByGenre(genreId, 6);
          }
        }

        if (related.length < 6) {
          // Fill with trending content if not enough genre-related content
          const trending = await contentAPI.getTrendingContent(6 - related.length);
          related = [...related, ...trending];
        }

        // Remove current content from related
        setRelatedContent(related.filter(item => item.id !== content.id));
      } catch (err) {
        console.error('Error fetching related content:', err);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    fetchRelatedContent();
  }, [content]);

  // Handle switching to another content
  const handleContentChange = (newContent: ContentItem) => {
    navigate(`/watch/${newContent.id}`);
    
    toast({
      title: `Reproduzindo agora: ${newContent.titulo}`,
      description: `${newContent.tipo === 'serie' ? 'Série' : 'Filme'} - ${newContent.ano_lancamento}`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center p-6">
          <Loader2 className="h-10 w-10 text-primary mx-auto animate-spin mb-4" />
          <h2 className="text-xl font-medium text-white">Carregando conteúdo...</h2>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Conteúdo não encontrado</h2>
          <p className="text-gray-400 mb-6">
            O conteúdo que você está tentando acessar não está disponível ou foi removido.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Página Inicial
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
        
        {/* Main content */}
        <VideoContentDisplay 
          content={content}
          relatedContent={relatedContent}
          onContentChange={handleContentChange}
          isPremiumUser={true} // In a real app, this would come from your auth context
        />
      </div>
    </div>
  );
};

export default Watch;
