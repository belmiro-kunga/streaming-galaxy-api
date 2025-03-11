import React from 'react';
import { Layout } from '@/components/ui/Layout';
import { MovieCarousel } from '@/components/ui/MovieCarousel';
import { motion } from 'framer-motion';

const FaroestePage = () => {
  return (
    <Layout>
      {/* Hero Section com efeito de faroeste */}
      <div className="relative h-[60vh] bg-gradient-to-b from-amber-800 to-black overflow-hidden">
        {/* Efeito de faroeste animado */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509795468115-0d29e4a1cba2?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative h-full flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              Faroeste
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Explore o velho oeste e viva aventuras épicas nas terras selvagens
            </p>
          </motion.div>
        </div>

        {/* Elementos decorativos de faroeste */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Conteúdo Principal */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 md:px-8 -mt-40 space-y-6 bg-gradient-to-b from-amber-800 to-black min-h-screen relative z-10"
      >
        {/* Seção Destaques */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Destaques em Faroeste</h2>
          <MovieCarousel 
            items={[]} 
            type="popular"
          />
        </motion.section>

        {/* Seção Lançamentos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Lançamentos</h2>
          <MovieCarousel 
            items={[]} 
            type="new"
          />
        </motion.section>

        {/* Seção Mais Assistidos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Mais Assistidos</h2>
          <MovieCarousel 
            items={[]} 
            type="popular"
          />
        </motion.section>

        {/* Seção Recomendados */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Recomendados para Você</h2>
          <MovieCarousel 
            items={[]} 
            type="recommended"
          />
        </motion.section>
      </motion.main>
    </Layout>
  );
};

export default FaroestePage; 