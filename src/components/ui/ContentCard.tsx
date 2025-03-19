
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Play, Info, Clock, Calendar } from 'lucide-react';
import { Button } from './button';
import { ContentItem } from '@/types/api';

interface ContentCardProps {
  item: ContentItem;
}

export const ContentCard = ({ item }: ContentCardProps) => {
  const navigate = useNavigate();

  const handleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/${item.id}`);
  };

  const handleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/details/${item.id}`);
  };

  const handleCardClick = () => {
    navigate(`/watch/${item.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="relative flex-shrink-0 w-full md:w-[220px] lg:w-[240px] rounded-lg overflow-hidden shadow-lg transition-all duration-300 cursor-pointer bg-gray-900 mt-4 md:mt-8"
    >
      {/* Imagem Principal */}
      <div className="relative aspect-[2/3]">
        <img 
          src={`https://source.unsplash.com/random/1920x1080?movie,${item.titulo}`} 
          alt={item.titulo}
          className="w-full h-full object-cover"
        />
        
        {/* Badge de Classificação */}
        <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium">
          {item.classificacao_etaria}
        </div>

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>
      </div>

      {/* Informações Básicas */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{item.titulo}</h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-200 mb-2">
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-500 mr-1" />
            <span>{(Math.random() * 4 + 6).toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{item.ano_lancamento}</span>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-1">
          <Button
            onClick={handleWatch}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs h-8"
            size="sm"
          >
            <Play className="w-3 h-3 mr-1" />
            Assistir
          </Button>
          
          <Button
            onClick={handleDetails}
            variant="outline"
            size="sm"
            className="flex-1 bg-black/50 border-gray-500 hover:bg-black/70 text-white text-xs h-8"
          >
            <Info className="w-3 h-3 mr-1" />
            Info
          </Button>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white mb-2">{item.titulo}</h3>
            
            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-200 mb-2">
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                <span>{(Math.random() * 4 + 6).toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{item.ano_lancamento}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>2h 15min</span>
              </div>
            </div>

            {/* Tipo e Gêneros */}
            <div className="flex flex-wrap items-center gap-1 mb-2">
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                {item.tipo === 'filme' ? 'Filme' : 'Série'}
              </span>
              <span className="text-gray-300 text-[10px]">
                Ação • Aventura • Ficção
              </span>
            </div>

            {/* Descrição */}
            <p className="text-gray-300 text-xs line-clamp-4">
              {item.descricao || 'Uma emocionante história que vai te prender do início ao fim.'}
            </p>
          </div>

          {/* Botões no Hover */}
          <div className="flex gap-1 mt-2">
            <Button
              onClick={handleWatch}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs h-8"
              size="sm"
            >
              <Play className="w-3 h-3 mr-1" />
              Assistir Agora
            </Button>
            
            <Button
              onClick={handleDetails}
              variant="outline"
              size="sm"
              className="flex-1 bg-black/50 border-gray-500 hover:bg-black/70 text-white text-xs h-8"
            >
              <Info className="w-3 h-3 mr-1" />
              Detalhes
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
