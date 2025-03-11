
import React, { useRef } from 'react';
import { Play, ChevronLeft, ChevronRight, Info, Plus } from 'lucide-react';
import { Button } from './button';
import { ContentItem } from '@/types/api';
import { motion } from 'framer-motion';
import '@/styles/cards.css';

interface MovieCarouselProps {
  items: ContentItem[];
  type: 'continue' | 'recommended' | 'popular' | 'trending' | 'new' | 'angolan';
}

export const MovieCarousel = ({ items, type }: MovieCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      const newScrollPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  // Placeholder data when no real items exist
  const demoItems = Array(8).fill(null).map((_, i) => ({
    id: `demo-${i}`,
    titulo: `Título do Filme ${i+1}`,
    ano_lancamento: 2023,
    classificacao_etaria: '16',
    descricao: 'Uma história empolgante cheia de ação e aventura.',
    tipo: Math.random() > 0.5 ? 'filme' : 'serie'
  }));

  const displayItems = items && items.length > 0 ? items : demoItems;

  return (
    <div className="relative group">
      {/* Botão de navegação esquerdo */}
      {showLeftArrow && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
      )}

      {/* Container dos cards */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar py-4 gap-2 scroll-smooth"
        onScroll={checkScrollButtons}
      >
        {/* Cards de filmes */}
        {displayItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex-none w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] group/card netflix-card"
          >
            <div className="relative aspect-[2/3] rounded overflow-hidden">
              {/* Poster do Filme */}
              <img 
                src={`https://source.unsplash.com/random/300x450?movie,${item.titulo}`} 
                alt={item.titulo}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Classificação */}
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
                {item.classificacao_etaria}
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                <div className="flex justify-center mb-2">
                  <Button
                    size="icon"
                    className="bg-white hover:bg-white/90 text-black rounded-full w-10 h-10 mr-2"
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full w-10 h-10 mr-2 border-white/40 hover:border-white"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full w-10 h-10 border-white/40 hover:border-white"
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
                
                <h3 className="text-sm font-semibold text-white line-clamp-1">{item.titulo}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                  <span>{item.ano_lancamento}</span>
                  <span className="inline-block h-1 w-1 rounded-full bg-gray-400"></span>
                  <span className="bg-red-600 text-white px-1 rounded text-[10px]">
                    {item.tipo === 'filme' ? 'FILME' : 'SÉRIE'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botão de navegação direito */}
      {showRightArrow && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      )}

      {/* Gradientes para indicar scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none" />
    </div>
  );
};
