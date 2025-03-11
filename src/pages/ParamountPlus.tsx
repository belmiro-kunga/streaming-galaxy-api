import React from 'react';
import { Layout } from '@/components/ui/Layout';
import { MovieCarousel } from '@/components/ui/MovieCarousel';
import { motion } from 'framer-motion';

const ParamountPlusPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-b from-blue-700 to-blue-500">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Paramount Plus</h1>
            <p className="text-xl text-white/80">Filmes, séries e conteúdo exclusivo</p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 md:px-8 -mt-40 space-y-6 bg-gradient-to-b from-blue-700 to-black min-h-screen relative z-10"
      >
        {/* Seção Continuar Assistindo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Continuar Assistindo</h2>
          <MovieCarousel 
            items={[]} 
            type="continue"
          />
        </motion.section>

        {/* Seção Em Alta */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Em Alta no Paramount Plus</h2>
          <MovieCarousel 
            items={[]} 
            type="popular"
          />
        </motion.section>

        {/* Seção Lançamentos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Lançamentos</h2>
          <MovieCarousel 
            items={[]} 
            type="new"
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

export default ParamountPlusPage; 