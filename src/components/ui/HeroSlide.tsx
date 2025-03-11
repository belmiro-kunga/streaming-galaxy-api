import React, { useState } from 'react';
import { Play, Plus, Star, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/api';

interface HeroSlideProps {
  content: ContentItem;
  videoId?: string;
}

export const HeroSlide = ({ content, videoId = '7ZzP1vgk5nA' }: HeroSlideProps) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative h-[90vh] md:min-h-[95vh] w-full overflow-hidden -mt-[32px] sm:-mt-[40px] md:-mt-[48px]">
      <div className="absolute inset-0">
        <div className="relative w-full h-full pt-[32px] sm:pt-[40px] md:pt-[48px]">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2"
              style={{ border: 'none' }}
            />
          ) : (
            <img 
              src={content.poster_url || content.backdrop_url} 
              alt={content.titulo}
              className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2"
            />
          )}
        </div>
        {/* Gradiente mais forte para o header */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent pointer-events-none" />
      </div>

      {/* Botão de controle de som */}
      {videoId && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-20 right-4 z-20 text-white hover:bg-white/10 rounded-full w-10 h-10"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      )}

      <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 md:p-12 lg:p-16 max-w-2xl pointer-events-auto">
        <div className="mb-4">
          <span className="text-sm text-gray-300">Duração: {content.duracao}</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-white font-bold">{content.avaliacao}</span>
          </div>
          <span className="text-sm text-gray-300">{content.generos?.join(' • ')} • {content.ano_lancamento}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{content.titulo}</h1>
        <p className="text-sm md:text-base mb-6 text-gray-300 line-clamp-3 md:line-clamp-4">
          {content.descricao || "Um filme épico sobre as belezas naturais e culturais de Angola."}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white border-none rounded-md">
            <Play className="mr-2 h-5 w-5" /> ASSISTIR
          </Button>
          <Button size="lg" variant="outline" className="bg-gray-800/60 text-white border-gray-700 rounded-md">
            <Plus className="mr-2 h-5 w-5" /> MINHA LISTA
          </Button>
        </div>
      </div>
    </div>
  );
}; 