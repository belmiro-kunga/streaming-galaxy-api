import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar botão quando rolar 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Função para rolar suavemente ao topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 p-3 bg-[#E50914] hover:bg-[#E50914]/90 text-white rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out backdrop-blur-sm"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="h-6 w-6 stroke-[2.5]" />
          <span className="sr-only">Voltar ao topo</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}; 