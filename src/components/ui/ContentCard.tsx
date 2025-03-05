
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { ContentItem } from '@/types/api';

interface ContentCardProps {
  item: ContentItem;
}

export const ContentCard = ({ item }: ContentCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 w-36 sm:w-44 md:w-56 lg:w-64 rounded-md overflow-hidden shadow-lg transition-all duration-300 cursor-pointer bg-gray-900"
    >
      <Link to={`/watch/${item.id}`}>
        <div className="relative">
          <img 
            src={`https://source.unsplash.com/random/300x450?movie,${item.titulo}`} 
            alt={item.titulo}
            className="w-full h-48 md:h-56 lg:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
            <h3 className="text-white font-medium truncate">{item.titulo}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="ml-1 text-white text-xs font-bold">
                  {(Math.random() * 4 + 6).toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-300">{item.ano_lancamento}</span>
            </div>
            <div className="flex items-center text-xs mt-1">
              <span className="bg-yellow-600 text-white px-1 py-0.5 rounded text-xs mr-2">
                {item.classificacao_etaria}
              </span>
              <span className="text-gray-300 text-xs">
                {item.tipo === 'filme' ? 'Filme' : 'Série'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
