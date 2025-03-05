
import React from 'react';
import { Play, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/api';

interface FeaturedContentProps {
  content: ContentItem;
}

export const FeaturedContent = ({ content }: FeaturedContentProps) => {
  return (
    <div className="relative h-[80vh] md:min-h-[85vh]">
      <div className="absolute inset-0">
        <img 
          src={`https://images.unsplash.com/photo-1649972904349-6e44c42644a7`}
          alt={content.titulo}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent" />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 lg:p-16 max-w-2xl">
        <div className="mb-4">
          <span className="text-sm text-gray-300">Duração: 1h 47m</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-white font-bold">8.2</span>
          </div>
          <span className="text-sm text-gray-300">Action • Aventura • {content.ano_lancamento}</span>
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
