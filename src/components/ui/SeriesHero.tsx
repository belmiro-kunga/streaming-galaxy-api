import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { Play, Info, Plus } from 'lucide-react';

interface SeriesHeroProps {
  title: string;
  logo: string;
  backgroundImage: string;
  year: string;
  rating: string;
  seasons: string;
  genre: string;
  description: string;
}

export const SeriesHero = ({
  title,
  logo,
  backgroundImage,
  year,
  rating,
  seasons,
  genre,
  description
}: SeriesHeroProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-[80vh] w-full"
    >
      {/* Background com Efeito Parallax */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: 'linear' }}
      >
        {/* Gradientes Sobrepostos */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </motion.div>

      {/* Conteúdo do Hero */}
      <div className="relative h-full flex items-end pb-20 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl space-y-6"
        >
          {/* Logo da Série */}
          <motion.img
            src={logo}
            alt={`${title} Logo`}
            className="w-64 md:w-80"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          />

          {/* Badges */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-300">{year}</span>
            <span className="px-2 py-1 bg-gray-800/80 rounded text-gray-300">{rating}</span>
            <span className="text-gray-300">{seasons}</span>
            <span className="text-gray-300">{genre}</span>
          </div>

          {/* Descrição */}
          <p className="text-gray-200 text-lg max-w-2xl line-clamp-3">
            {description}
          </p>

          {/* Botões de Ação */}
          <div className="flex items-center gap-4">
            <Button 
              size="lg" 
              className="bg-white hover:bg-white/90 text-black font-semibold px-8 transition-transform hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" /> Assistir
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 transition-transform hover:scale-105"
            >
              <Info className="mr-2 h-5 w-5" /> Mais Informações
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full border-2 transition-transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Vinheta inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </motion.div>
  );
}; 