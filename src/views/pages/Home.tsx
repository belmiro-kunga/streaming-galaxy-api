import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { ContentItem, Genre } from '@/types/api';
import { Header } from '@/components/ui/Header';
import { FeaturedContent } from '@/components/ui/FeaturedContent';
import { ContentRow } from '@/components/ui/ContentRow';
import { GenreFilter } from '@/components/ui/GenreFilter';
import { StreamingServicesRow } from '@/components/ui/StreamingServicesRow';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { AnimatePresence } from 'framer-motion';
import { HomePresenter, HomeView } from '@/presenters/HomePresenter';

const Home = () => {
  // Estados
  const [featuredContent, setFeaturedContent] = useState<ContentItem | null>(null);
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContentItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [contentByGenre, setContentByGenre] = useState<{ [key: string]: ContentItem[] }>({});
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [topRatedContent, setTopRatedContent] = useState<ContentItem[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([]);
  const [activeGenres, setActiveGenres] = useState<string[]>(['1', '8']);
  const [isLoading, setLoading] = useState(true);

  // Hooks
  const { toast } = useToast();
  const isMobile = useMobile();
  const isTV = window.innerWidth >= 1920;

  // Criando a implementação da interface HomeView
  const view: HomeView = {
    setFeaturedContent: (content) => setFeaturedContent(content),
    setTrendingContent: (content) => setTrendingContent(content),
    setContinueWatching: (content) => setContinueWatching(content),
    setGenres: (content) => setGenres(content),
    setContentByGenre: (content) => setContentByGenre(content),
    setRecentContent: (content) => setRecentContent(content),
    setTopRatedContent: (content) => setTopRatedContent(content),
    setRecommendedContent: (content) => setRecommendedContent(content),
    setLoading: (loading) => setLoading(loading),
    showError: (message) => {
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    }
  };

  // Instanciando o presenter
  const presenter = React.useMemo(() => new HomePresenter(view), []);

  // Event Handlers
  const toggleGenre = async (genreId: string) => {
    setActiveGenres(prev => {
      const newActiveGenres = prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId];
      
      // Carregar conteúdo do novo gênero se foi adicionado
      if (!prev.includes(genreId)) {
        presenter.loadContentByGenre(genreId);
      }
      
      return newActiveGenres;
    });
  };

  // Effects
  useEffect(() => {
    console.log('Iniciando carregamento de dados...');
    presenter.loadInitialData().catch(error => {
      console.error('Erro ao carregar dados iniciais:', error);
    });
  }, [presenter]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <div className="min-h-screen bg-black text-white">
        <Header />

        <main className="pb-20">
          {/* Featured Content */}
          {featuredContent && <FeaturedContent content={featuredContent} />}

          <div className="px-4 md:px-8 py-8">
            {/* Genres Filter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Descubra</h2>
                  <div className="ml-2 w-2 h-2 rounded-full bg-red-600"></div>
                </div>
              </div>
              
              {/* Genre Pills */}
              <GenreFilter 
                genres={genres} 
                activeGenres={activeGenres} 
                toggleGenre={toggleGenre} 
              />
            </div>

            {/* Streaming Services Row */}
            <StreamingServicesRow />

            {/* Continue Watching (if available) */}
            {continueWatching.length > 0 && (
              <ContentRow
                title="Continue Assistindo"
                content={continueWatching}
                seeAllLink="/my-list"
              />
            )}

            {/* Trending Content Row */}
            <ContentRow
              title="Em Alta"
              content={trendingContent}
              seeAllLink="/trending"
            />
            
            {/* Recommended For You */}
            {recommendedContent.length > 0 && (
              <ContentRow
                title="Recomendado Para Você"
                content={recommendedContent}
                seeAllLink="/recommended"
              />
            )}
            
            {/* Recently Added */}
            <ContentRow
              title="Adicionados Recentemente"
              content={recentContent}
              seeAllLink="/recent"
            />
            
            {/* Top Rated */}
            <ContentRow
              title="Mais Bem Avaliados"
              content={topRatedContent}
              seeAllLink="/top-rated"
            />

            {/* Content by Genres */}
            {genres
              .filter(genre => activeGenres.includes(genre.id))
              .map((genre) => (
                <ContentRow
                  key={genre.id}
                  title={genre.nome}
                  content={contentByGenre[genre.id] || []}
                  seeAllLink={`/genre/${genre.id}`}
                />
              ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
