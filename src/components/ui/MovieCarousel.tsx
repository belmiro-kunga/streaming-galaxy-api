import React, { useRef } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { ContentItem } from '@/types/api';
import { motion } from 'framer-motion';
import '@/styles/cards.css';

interface MovieCarouselProps {
  items: ContentItem[];
  type: 'continue' | 'recommended' | 'popular' | 'new' | 'angolan';
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

  return (
    <div className="content-container">
      {/* Botão de navegação esquerdo */}
      {showLeftArrow && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="nav-button prev"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
      )}

      {/* Container dos cards */}
      <div
        ref={scrollContainerRef}
        className="content-grid"
        onScroll={checkScrollButtons}
      >
        {/* Cards de filmes */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="content-card"
          >
            {/* Poster do Filme */}
            <div className="absolute inset-0 bg-muted animate-pulse" />
            
            {/* Overlay com informações */}
            <div className="content-card-overlay">
              <div className="content-card-info">
                <h3 className="text-sm font-semibold text-white line-clamp-2">Título do Filme</h3>
                <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                  <span>2024</span>
                  <span>2h 15min</span>
                </div>
              </div>
            </div>

            {/* Botão de play no hover */}
            <div className="content-card-play">
              <Button
                size="icon"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12"
              >
                <Play className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botão de navegação direito */}
      {showRightArrow && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="nav-button next"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
}; 