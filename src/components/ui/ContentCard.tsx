
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Play, Info, Clock, Calendar, Lock } from 'lucide-react';
import { Button } from './button';
import { ContentItem } from '@/types/api';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  item: ContentItem;
  isPremiumUser?: boolean;
}

export const ContentCard = ({ item, isPremiumUser = true }: ContentCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if content requires subscription
  const requiresSubscription = !item.gratuito && !isPremiumUser;

  const handleWatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (requiresSubscription) {
      navigate('/subscription-plans');
      return;
    }
    
    navigate(`/watch/${item.id}`);
  };

  const handleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/details/${item.id}`);
  };

  const handleCardClick = () => {
    if (requiresSubscription) {
      navigate('/subscription-plans');
      return;
    }
    
    navigate(`/details/${item.id}`);
  };

  // Format genres as a string
  const genresString = item.generos && item.generos.length > 0 
    ? item.generos.join(' • ') 
    : 'Gênero não especificado';

  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex-shrink-0 w-full md:w-[220px] lg:w-[240px] rounded-lg overflow-hidden shadow-lg transition-all duration-300 cursor-pointer bg-gray-900"
    >
      {/* Imagem Principal */}
      <div className="relative aspect-[2/3]">
        <img 
          src={item.poster_url || `https://source.unsplash.com/random/300x450?movie,${item.titulo}`} 
          alt={item.titulo}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Badge de Classificação */}
        <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium">
          {item.classificacao_etaria}
        </div>

        {/* Premium Content Badge */}
        {!item.gratuito && (
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="bg-black/50 border-gold text-gold">
              <Lock className="w-3 h-3 mr-1" /> Premium
            </Badge>
          </div>
        )}

        {/* New Badge for recently added content */}
        {item.data_adicao && new Date(item.data_adicao) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
          <div className="absolute top-10 right-2">
            <Badge className="bg-red-600 text-white">Novo</Badge>
          </div>
        )}

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>
      </div>

      {/* Informações Básicas */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{item.titulo}</h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-200 mb-2">
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-500 mr-1" />
            <span>{item.avaliacao || (Math.random() * 4 + 6).toFixed(1)}</span>
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
            className={cn(
              "flex-1 text-white text-xs h-8",
              requiresSubscription ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
            )}
            size="sm"
          >
            {requiresSubscription ? (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Assinar
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Assistir
              </>
            )}
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
      {isHovered && (
        <div 
          className="absolute inset-0 bg-black/80 p-3 flex flex-col z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-bold text-white mb-2">{item.titulo}</h3>
            
            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-200 mb-2">
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                <span>{item.avaliacao || (Math.random() * 4 + 6).toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{item.ano_lancamento}</span>
              </div>
              {item.duracao && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{item.duracao}</span>
                </div>
              )}
            </div>

            {/* Tipo e Gêneros */}
            <div className="flex flex-wrap items-center gap-1 mb-2">
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                {item.tipo === 'filme' ? 'Filme' : item.tipo === 'serie' ? 'Série' : 'Documentário'}
              </span>
              <span className="text-gray-300 text-[10px]">
                {genresString}
              </span>
            </div>

            {/* Descrição */}
            <p className="text-gray-300 text-xs line-clamp-4 mb-3">
              {item.descricao || 'Uma emocionante história que vai te prender do início ao fim.'}
            </p>

            {/* Qualidades disponíveis */}
            {(item.video_url_480p || item.video_url_720p || item.video_url_1080p) && (
              <div className="flex gap-1 mb-3">
                {item.video_url_480p && (
                  <Badge variant="outline" className="text-[10px] border-gray-500 text-gray-300">480p</Badge>
                )}
                {item.video_url_720p && (
                  <Badge variant="outline" className="text-[10px] border-gray-500 text-gray-300">720p</Badge>
                )}
                {item.video_url_1080p && (
                  <Badge variant="outline" className="text-[10px] border-gray-500 text-gray-300">1080p</Badge>
                )}
              </div>
            )}
          </div>

          {/* Botões no Hover */}
          <div className="flex gap-1 mt-auto">
            <Button
              onClick={handleWatch}
              className={cn(
                "flex-1 text-white text-xs h-8",
                requiresSubscription ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"
              )}
              size="sm"
            >
              {requiresSubscription ? (
                <>
                  <Lock className="w-3 h-3 mr-1" />
                  Assinar Agora
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Assistir Agora
                </>
              )}
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
      )}
    </motion.div>
  );
};
