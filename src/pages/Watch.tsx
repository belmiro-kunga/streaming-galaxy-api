
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, ThumbsUp, Plus, VolumeX, Volume2, Maximize, Settings } from 'lucide-react';
import { ContentItem } from '@/types/api';
import { contentAPI } from '@/services/api';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch the specific content by ID
        // For now, we'll use the featured content as a placeholder
        const data = await contentAPI.getFeatureContent();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContent();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Conteúdo não encontrado</h1>
        <Link to="/home" className="text-red-600 hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Video Player */}
      <div className="relative w-full h-screen">
        {/* Video (placeholder) */}
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <img 
            src={`https://source.unsplash.com/random/1920x1080?movie,${content.titulo}`}
            alt={content.titulo}
            className="w-full h-full object-cover"
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white fill-current ml-1" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21" />
                </svg>
              </div>
            </button>
          </div>
        </div>
        
        {/* Player controls */}
        <div className="absolute inset-x-0 top-0 p-4 flex items-center">
          <Link to="/home">
            <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">{content.titulo}</h1>
        </div>
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-6 px-4">
          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-600 rounded-full mb-4">
            <div className="h-full w-1/3 bg-red-600 rounded-full"></div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                {isMuted ? (
                  <VolumeX className="w-6 h-6" onClick={() => setIsMuted(false)} />
                ) : (
                  <Volume2 className="w-6 h-6" onClick={() => setIsMuted(true)} />
                )}
              </Button>
              <span className="text-sm">0:42 / 1:47:12</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                <Plus className="w-6 h-6" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                <ThumbsUp className="w-6 h-6" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                <Share2 className="w-6 h-6" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                <Settings className="w-6 h-6" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                <Maximize className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
