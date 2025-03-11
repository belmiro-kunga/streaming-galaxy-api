import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Plus, Star } from 'lucide-react';

export const VideoSlide = () => {
  const videoId = '9KZyUQpihsE';

  return (
    <div className="relative h-[80vh] md:min-h-[85vh] w-full overflow-hidden -mt-10">
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2"
            style={{ border: 'none' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 lg:p-16 max-w-2xl pointer-events-auto">
        <div className="mb-4">
          <span className="text-sm text-gray-300">1 Temporada</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-white font-bold">98%</span>
          </div>
          <span className="text-sm text-gray-300">Drama • Suspense • 2024</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
          Séries Exclusivas
        </h1>
        <p className="text-sm md:text-base mb-6 text-gray-300 line-clamp-3 md:line-clamp-4">
          Assista às melhores séries do momento com qualidade excepcional e conteúdo exclusivo.
          Histórias envolventes, produções premiadas e experiências únicas aguardam por você.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white border-none rounded-md font-semibold"
          >
            <Play className="mr-2 h-5 w-5" /> ASSISTIR
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-gray-800/60 hover:bg-gray-800/80 text-white border-gray-600 rounded-md font-semibold"
          >
            <Plus className="mr-2 h-5 w-5" /> MINHA LISTA
          </Button>
        </div>
      </div>
    </div>
  );
};