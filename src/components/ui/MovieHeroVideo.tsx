import React from 'react';
import { Play, Info } from 'lucide-react';
import { Button } from './button';

export const MovieHeroVideo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden -mt-[64px]">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2">
            <iframe
              src="https://www.youtube.com/embed/0BtkWiO-Lr4?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&loop=1&playlist=0BtkWiO-Lr4&enablejsapi=1&origin=http://localhost:3000"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              style={{ 
                border: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>
          {/* Gradientes para melhorar a visibilidade do conteúdo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black from-20% via-black/50 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative w-full h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 mt-20">
          <div className="max-w-3xl space-y-4 md:space-y-6">
            {/* Prime Tag */}
            <div className="flex items-center gap-2">
              <span className="bg-red-600 px-3 py-1 text-xs font-semibold rounded">PRIME</span>
              <span className="text-sm text-gray-200">Incluído no seu plano</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white drop-shadow-lg leading-tight">
              Rebel Moon - Parte 1: A Menina do Fogo
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-200">
              <span>2024</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full hidden md:block"></span>
              <span>2h 15min</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full hidden md:block"></span>
              <span className="px-2 py-0.5 border border-gray-400 rounded text-xs">16</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full hidden md:block"></span>
              <span>4K UHD</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full hidden md:block"></span>
              <span>HDR</span>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg text-gray-200 max-w-2xl line-clamp-2 md:line-clamp-3 drop-shadow">
              Quando uma colônia pacífica na borda da galáxia se vê ameaçada pelos exércitos do poderoso regente Balisarius, eles enviam a jovem Kora, com um passado misterioso, para procurar guerreiros de planetas vizinhos para ajudá-los a resistir.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 md:gap-4 pt-4 md:pt-6">
              <Button 
                size="default"
                className="bg-red-600 hover:bg-red-700 text-white px-4 md:px-8 py-4 md:py-6 text-sm md:text-lg transition-transform hover:scale-105 h-auto"
              >
                <Play className="mr-2 h-4 w-4 md:h-6 md:w-6" /> Assistir Agora
              </Button>
              <Button 
                size="default"
                variant="outline" 
                className="bg-black/30 backdrop-blur-sm text-white border-gray-400 hover:bg-black/50 px-4 md:px-8 py-4 md:py-6 text-sm md:text-lg transition-transform hover:scale-105 h-auto"
              >
                <Info className="mr-2 h-4 w-4 md:h-6 md:w-6" /> Mais Informações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 