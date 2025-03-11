import React from 'react';
import { Layout } from '@/components/ui/Layout';
import { MovieCarousel } from '@/components/ui/MovieCarousel';
import { motion } from 'framer-motion';
import { VideoSlide } from '@/components/ui/VideoSlide';

const SeriesPage = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-black"
      >
        <VideoSlide />

        {/* Conteúdo Principal */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 md:px-8 py-8 space-y-12 bg-black min-h-screen"
        >
          {/* Seção Continuar Assistindo */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white">Continuar Assistindo</h2>
            <MovieCarousel 
              items={[]} 
              type="continue"
            />
          </motion.section>

          {/* Séries Originais */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white">Séries Originais</h2>
            <MovieCarousel 
              items={[]} 
              type="recommended"
            />
          </motion.section>

          {/* Séries Premiadas */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white">Séries Premiadas</h2>
            <MovieCarousel 
              items={[]} 
              type="popular"
            />
          </motion.section>

          {/* Novos Episódios */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white">Novos Episódios</h2>
            <MovieCarousel 
              items={[]} 
              type="new"
            />
          </motion.section>

          {/* Séries Angolanas */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white">Séries Angolanas</h2>
            <MovieCarousel 
              items={[]} 
              type="angolan"
            />
          </motion.section>

          {/* Séries em Alta */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white">Em Alta</h2>
            <MovieCarousel 
              items={[]} 
              type="popular"
            />
          </motion.section>
        </motion.main>
      </motion.div>
    </Layout>
  );
};

export default SeriesPage; 