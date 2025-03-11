
import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Layout } from '@/components/ui/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/api';
import { useNavigate } from 'react-router-dom';
import { IHomeView } from '@/mvp/contracts/HomeContracts';
import { HomeModel } from '@/mvp/models/HomeModel';
import { HomePresenter } from '@/mvp/presenters/HomePresenter';
import { motion } from 'framer-motion';

const Home = () => {
  // States for different content categories
  const [featuredContent, setFeaturedContent] = useState<ContentItem | null>(null);
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [popularContent, setPopularContent] = useState<ContentItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContentItem[]>([]);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [topRatedContent, setTopRatedContent] = useState<ContentItem[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [contentByGenre, setContentByGenre] = useState({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Implementation of IHomeView interface
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

  // Content row component for reusability
  const ContentRow = ({ title, items, link }: { title: string, items: ContentItem[], link?: string }) => {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {link && (
            <Button variant="link" className="text-gray-400 hover:text-white" onClick={() => navigate(link)}>
              Ver tudo
            </Button>
          )}
        </div>
        <div className="relative group">
          <div className="overflow-x-auto scrollbar-hide flex space-x-2 pb-4">
            {items.map((item, index) => (
              <motion.div 
                key={item.id || index}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="flex-none w-[200px] md:w-[220px] lg:w-[240px] relative rounded overflow-hidden transition-all duration-300 group/item"
              >
                <img 
                  src={item.poster_url || `https://source.unsplash.com/random/400x600?movie,${index}`} 
                  alt={item.titulo} 
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white font-bold text-sm mb-1">{item.titulo}</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    <span className="text-green-500 text-xs">{item.avaliacao || `${Math.floor(Math.random() * 100)}% Match`}</span>
                    <span className="text-gray-400 text-xs border px-1">{item.classificacao_etaria || '16'}</span>
                    <span className="text-gray-400 text-xs">{item.duracao || '2h 30m'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-white/30 hover:bg-white/20">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-white/30 hover:bg-white/20">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-white/30 hover:bg-white/20">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-white/30 hover:bg-white/20">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-white/30 hover:bg-white/20">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Genres */}
                  <div className="flex mt-2 flex-wrap gap-1">
                    {(item.generos || ['Ação', 'Drama']).map((genre, i) => (
                      <span key={i} className="text-xs text-gray-400">
                        {i > 0 && '•'} {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-pulse">
          <svg viewBox="0 0 111 30" className="h-12 w-auto fill-red-600" aria-hidden="true">
            <path d="M105.06 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.7-.24-3.4-.507-5.09-.773l9.09-20.766 9.87.6v1.44L105.06 14.28M90.234 0v27.25c-1.74.02-3.49.048-5.24.084V.083l5.24-.083M61.902.181c1.74 0 3.49.03 5.23.083v26.986c-1.74.053-3.48.098-5.23.147v-12.48l-3.58 8.044c-1.49-.033-2.99-.064-4.49-.098a7369.268 7369.268 0 0 0 3.83-8.816V.766l4.24-.585m-30.967 19.93c4.93 0 5.36-6.42 5.36-11.29C36.295 4.39 36.576 0 31.935 0c-4.65 0-5.27 4.39-5.27 8.63 0 4.69.42 11.48 5.27 11.48m0-26.49c7.65 0 10.59 5.54 10.59 15.42 0 9.61-3.74 14.21-10.59 14.21-6.85 0-10.58-4.6-10.58-14.21 0-10.18 3.52-15.42 10.58-15.42M75.23.084v26.852c-1.74.033-3.493.068-5.25.104V9.654l-2.2 12.812c-1.25.02-2.496.035-3.748.057L61.83 9.653v16.622c-1.22.02-2.44.035-3.66.054V.08c2.05 0 4.1-.057 6.15-.057l2.08 12.214L68.46.026 75.23.084zM20.345 25.097V.076h17.834v6.649c-2.1 0-4.213.016-6.335.04V8.96c1.853.016 3.716.035 5.583.057v6.65c-1.867.02-3.73.042-5.584.066v2.677c2.352.03 4.678.06 6.955.095v6.65c-6.153.11-12.356.235-18.623.376v-.434z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative w-full h-[90vh] mt-[48px]">
        {/* Hero Background */}
        <div className="absolute inset-0">
          {featuredContent?.trailer_url ? (
            <iframe
              src={`https://www.youtube.com/embed/7ZzP1vgk5nA?autoplay=1&loop=1&playlist=7ZzP1vgk5nA&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full object-cover"
              style={{ border: 'none' }}
            />
          ) : (
            <img 
              src={featuredContent?.poster_url || "https://source.unsplash.com/random/1920x1080?movie"} 
              alt="Featured Content" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16 z-10">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4 max-w-2xl">
            {featuredContent?.titulo || "Cobra Kai"}
          </h1>
          <p className="text-white max-w-xl mb-6 text-sm md:text-base line-clamp-3">
            {featuredContent?.descricao || "Há mais de 30 anos, um deles ficou em segundo lugar. Agora, ele quer vencer — e não tem nada a perder."}
          </p>
          <div className="flex space-x-4">
            <Button size="lg" className="bg-white hover:bg-white/90 text-black font-bold">
              <Play className="mr-2 h-5 w-5" fill="black" /> Assistir
            </Button>
            <Button size="lg" variant="outline" className="bg-gray-800/60 text-white border-gray-400">
              <Info className="mr-2 h-5 w-5" /> Mais informações
            </Button>
          </div>
          {/* Age Rating Badge */}
          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 lg:bottom-16 lg:right-16">
            <div className="bg-gray-800 text-white px-2 py-1 text-sm md:text-base">
              12
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-6 md:px-12 lg:px-16 py-8 bg-black">
        {/* Popular on Netflix */}
        <ContentRow 
          title="Populares na Netflix" 
          items={topRatedContent || Array(8).fill({
            id: 'placeholder',
            titulo: 'Título do Filme',
            classificacao_etaria: '16',
            duracao: '2h 15m',
            generos: ['Ação', 'Drama']
          })}
          link="/popular"
        />

        {/* Continue Watching */}
        {continueWatching?.length > 0 && (
          <ContentRow 
            title="Continuar assistindo como Darlan" 
            items={continueWatching} 
            link="/continue"
          />
        )}

        {/* Trending Now */}
        <ContentRow 
          title="Em alta" 
          items={trendingContent || Array(8).fill({
            id: 'placeholder',
            titulo: 'Título do Filme',
            classificacao_etaria: '16',
            duracao: '1h 45m',
            generos: ['Thriller', 'Suspense']
          })}
          link="/trending"
        />

        {/* Recently Added */}
        <ContentRow 
          title="Adicionados recentemente" 
          items={recentContent || Array(8).fill({
            id: 'placeholder',
            titulo: 'Título do Filme',
            classificacao_etaria: '16',
            duracao: '1h 30m',
            generos: ['Comédia', 'Romance']
          })}
          link="/recent"
        />

        {/* Recommended for You */}
        {recommendedContent?.length > 0 && (
          <ContentRow 
            title="Recomendados para você" 
            items={recommendedContent} 
            link="/recommended"
          />
        )}
      </div>
    </Layout>
  );
};

export default Home;
