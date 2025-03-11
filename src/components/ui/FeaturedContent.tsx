import React from 'react';
import { Play, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/api';

interface FeaturedContentProps {
  content: ContentItem;
}

export const FeaturedContent = ({ content }: FeaturedContentProps) => {
  const videoId = '7ZzP1vgk5nA';

  return (
    <div className="relative w-full h-[85vh] mt-[48px]">
      <div className="absolute inset-0">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover"
          style={{ border: 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-end p-6 max-w-2xl">
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
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{content.titulo}</h1>
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
