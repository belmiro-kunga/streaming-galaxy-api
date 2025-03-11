
import React, { useEffect, useState } from 'react';
import { ContentItem, Genre } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { Layout } from '@/components/ui/Layout';
import { MovieCarousel } from '@/components/ui/MovieCarousel';
import { MovieHero } from '@/components/ui/MovieHero';
import { StreamingCards } from '@/components/ui/StreamingCards';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { IHomeView } from '@/mvp/contracts/HomeContracts';
import { HomeModel } from '@/mvp/models/HomeModel';
import { HomePresenter } from '@/mvp/presenters/HomePresenter';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [featuredContent, setFeaturedContent] = useState<ContentItem | null>(null);
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContentItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [contentByGenre, setContentByGenre] = useState<{ [key: string]: ContentItem[] }>({});
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [topRatedContent, setTopRatedContent] = useState<ContentItem[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useMobile();
  const navigate = useNavigate();

  // Implementação da interface IHomeView
  const view: IHomeView = {
    setFeaturedContent: (content) => setFeaturedContent(content),
    setTrendingContent: (content) => setTrendingContent(content),
    setContinueWatching: (content) => setContinueWatching(content),
    setGenres: (genresData) => setGenres(genresData),
    setContentByGenre: (content) => setContentByGenre(content),
    setRecentContent: (content) => setRecentContent(content),
    setTopRatedContent: (content) => setTopRatedContent(content),
    setRecommendedContent: (content) => setRecommendedContent(content),
    setLoading: (loading) => setIsLoading(loading),
    showError: (message) => toast({
      title: 'Erro',
      description: message,
      variant: 'destructive',
    })
  };

  useEffect(() => {
    const model = new HomeModel();
    const presenter = new HomePresenter(model, view);
    
    presenter.initialize();

    return () => {
      presenter.dispose();
    };
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <MovieHero />

      {/* Conteúdo Principal */}
      <motion.main 
        initial={{ opacity: H0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 md:px-8 -mt-40 space-y-6 bg-black min-h-screen relative z-10"
      >
        {/* Seção de Streaming Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Streaming Services</h2>
          <StreamingCards />
        </motion.section>

        {/* Navegação por Categorias */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 pt-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Categorias</h2>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 relative group">
            {/* Botão de navegação esquerda */}
            <button
              onClick={() => {
                const container = document.getElementById('categorias-container');
                if (container) {
                  container.scrollBy({
                    left: -200,
                    behavior: 'smooth'
                  });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4 hidden md:block"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Container das categorias */}
            <div 
              id="categorias-container"
              className="flex overflow-x-auto no-scrollbar gap-2 scroll-smooth snap-x snap-mandatory"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {[
                'Ação',
                'Aventura',
                'Comédia',
                'Drama',
                'Faroeste',
                'Fantasia',
                'Ficção científica',
                'Mistério',
                'Musical',
                'Romance',
                'Terror',
                'Thriller'
              ].map((categoria) => (
                <button
                  key={categoria}
                  onClick={() => navigate(
                    categoria === 'Ação' ? '/acao' : 
                    categoria === 'Aventura' ? '/aventura' : 
                    categoria === 'Comédia' ? '/comedia' : 
                    categoria === 'Drama' ? '/drama' : 
                    categoria === 'Faroeste' ? '/faroeste' : 
                    '#'
                  )}
                  className="flex-none px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap snap-center"
                >
                  {categoria}
                </button>
              ))}
            </div>

            {/* Botão de navegação direita */}
            <button
              onClick={() => {
                const container = document.getElementById('categorias-container');
                if (container) {
                  container.scrollBy({
                    left: 200,
                    behavior: 'smooth'
                  });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4 hidden md:block"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Gradientes para indicar scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none" />
          </div>
        </motion.section>

        {/* Seção Populares na Netflix (como no exemplo) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 pt-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Populares na CinePlay</h2>
          <MovieCarousel 
            items={topRatedContent} 
            type="popular"
          />
        </motion.section>

        {/* Seção Continuar Assistindo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 pt-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Continuar Assistindo</h2>
          <MovieCarousel 
            items={continueWatching} 
            type="continue"
          />
        </motion.section>

        {/* Seção Em Alta */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4 pt-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Em Alta</h2>
          <MovieCarousel 
            items={trendingContent} 
            type="trending"
          />
        </motion.section>

        {/* Seção Recomendados */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 pt-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">Recomendados para Você</h2>
          <MovieCarousel 
            items={recommendedContent} 
            type="recommended"
          />
        </motion.section>
      </motion.main>
    </Layout>
  );
};

export default Home;
