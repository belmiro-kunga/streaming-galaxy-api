import React from 'react';
import { Layout } from '@/components/ui/Layout';
import { MovieCarousel } from '@/components/ui/MovieCarousel';
import { MovieHeroVideo } from '@/components/ui/MovieHeroVideo';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const MoviesPage = () => {
  return (
    <Layout>
      {/* Hero Section com filme em destaque */}
      <MovieHeroVideo />

      {/* Conteúdo Principal */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 md:px-8 -mt-40 space-y-6 bg-black min-h-screen relative z-10"
      >
        {/* Navegação por Categorias */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Categorias</h2>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
            <Tabs defaultValue="todos" className="w-full">
              <div className="w-full overflow-x-auto no-scrollbar">
                <TabsList className="inline-flex w-max space-x-2 bg-transparent p-0">
                  <TabsTrigger 
                    value="todos" 
                    className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600 whitespace-nowrap px-4 py-2 rounded-md hover:text-white transition-colors"
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="acao" 
                    className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600 whitespace-nowrap px-4 py-2 rounded-md hover:text-white transition-colors"
                  >
                    Ação
                  </TabsTrigger>
                  <TabsTrigger 
                    value="comedia" 
                    className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600 whitespace-nowrap px-4 py-2 rounded-md hover:text-white transition-colors"
                  >
                    Comédia
                  </TabsTrigger>
                  <TabsTrigger 
                    value="drama" 
                    className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600 whitespace-nowrap px-4 py-2 rounded-md hover:text-white transition-colors"
                  >
                    Drama
                  </TabsTrigger>
                  <TabsTrigger 
                    value="romance" 
                    className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600 whitespace-nowrap px-4 py-2 rounded-md hover:text-white transition-colors"
                  >
                    Romance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documentario" 
                    className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600 whitespace-nowrap px-4 py-2 rounded-md hover:text-white transition-colors"
                  >
                    Documentário
                  </TabsTrigger>
                  <TabsTrigger 
                    value="terror" 
                    className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600 whitespace-nowrap px-4 py-2 rounded-md hover:text-white transition-colors"
                  >
                    Terror
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
        </motion.section>

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

        {/* Seção Recomendados */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Recomendados para Você</h2>
          <MovieCarousel 
            items={[]} 
            type="recommended"
          />
        </motion.section>

        {/* Seção Mais Populares */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Mais Populares</h2>
          <MovieCarousel 
            items={[]} 
            type="popular"
          />
        </motion.section>

        {/* Seção Lançamentos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Lançamentos</h2>
          <MovieCarousel 
            items={[]} 
            type="new"
          />
        </motion.section>

        {/* Seção Filmes Angolanos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Cinema Angolano</h2>
          <MovieCarousel 
            items={[]} 
            type="angolan"
          />
        </motion.section>
      </motion.main>
    </Layout>
  );
};

export default MoviesPage; 