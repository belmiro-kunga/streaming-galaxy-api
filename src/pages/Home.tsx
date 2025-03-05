
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, ChevronRight, Search, Bell, Menu, User, Star, LogOut, Settings, CreditCard, Gauge } from 'lucide-react';
import { contentAPI, userInteractionAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentItem {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  ano_lancamento: number;
  classificacao_etaria: string;
  gratuito: boolean;
}

interface Genre {
  id: string;
  nome: string;
}

const Home = () => {
  const [featuredContent, setFeaturedContent] = useState<ContentItem | null>(null);
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [contentByGenre, setContentByGenre] = useState<{ [key: string]: ContentItem[] }>({});
  const [activeTab, setActiveTab] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useMobile();
  const isTV = window.innerWidth >= 1920;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get featured content
        const featuredData = await contentAPI.getFeatureContent();
        setFeaturedContent(featuredData);

        // Get trending content
        const trending = await contentAPI.getTrendingContent(20);
        setTrendingContent(Array.isArray(trending) ? trending : []);

        // Get all genres
        const genresData = await contentAPI.getAllGenres();
        setGenres(genresData);

        // Get content by genre
        const contentGenres: { [key: string]: ContentItem[] } = {};
        for (const genre of genresData.slice(0, 8)) {
          try {
            const content = await contentAPI.getContentByGenre(genre.id, 10);
            // Handle potential array of arrays or non-conforming data
            if (Array.isArray(content)) {
              // If it's an array of arrays, flatten it and filter out invalid items
              const flattenedContent = Array.isArray(content[0]) 
                ? content.flat()
                : content;
              
              // Ensure each item has the required properties of ContentItem
              contentGenres[genre.id] = flattenedContent.filter((item): item is ContentItem => {
                return item && 
                  typeof item === 'object' && 
                  'id' in item && 
                  'tipo' in item && 
                  'titulo' in item && 
                  'descricao' in item && 
                  'ano_lancamento' in item && 
                  'classificacao_etaria' in item && 
                  'gratuito' in item;
              });
            } else {
              contentGenres[genre.id] = [];
            }
          } catch (error) {
            console.error(`Error fetching content for genre ${genre.nome}:`, error);
            contentGenres[genre.id] = [];
          }
        }
        setContentByGenre(contentGenres);

        // Get continue watching content
        // This would need authenticated user
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const watchingData = await userInteractionAPI.getContinueWatching(userId);
            setContinueWatching(watchingData);
          }
        } catch (error) {
          console.log('User not authenticated or error fetching watch history');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os conteúdos. Tente novamente mais tarde.',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderContentCards = (content: ContentItem[]) => {
    if (!Array.isArray(content)) {
      console.error('Content is not an array:', content);
      return null;
    }
    
    return content.map((item) => {
      if (!item || typeof item !== 'object' || !item.id) {
        console.error('Invalid content item:', item);
        return null;
      }
      
      return (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.05, zIndex: 10 }}
          whileTap={{ scale: 0.98 }}
          className="flex-shrink-0 w-48 md:w-56 lg:w-64 rounded-md overflow-hidden shadow-lg transition-all duration-300 cursor-pointer"
        >
          <Link to={`/watch/${item.id}`}>
            <div className="relative">
              <img 
                src={`https://source.unsplash.com/random/300x450?movie,${item.titulo}`} 
                alt={item.titulo}
                className="w-full h-48 md:h-56 lg:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                <h3 className="text-white font-medium truncate">{item.titulo}</h3>
                <div className="flex items-center text-xs text-gray-300 mt-1">
                  <span className="bg-yellow-600 text-white px-1 py-0.5 rounded text-xs mr-2">
                    {item.classificacao_etaria}
                  </span>
                  <span>{item.ano_lancamento}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      );
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-gradient-to-b from-black/90 to-transparent absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <Link to="/" className="text-[#E50914] font-bold text-2xl mr-8">STREAMGALAXY</Link>
          
          {!isMobile && (
            <div className="hidden md:flex space-x-8">
              <Tabs defaultValue="all" className="w-[400px]">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="all" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Início</TabsTrigger>
                  <TabsTrigger value="movies" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Filmes</TabsTrigger>
                  <TabsTrigger value="series" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Séries</TabsTrigger>
                  <TabsTrigger value="more" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Mais</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-white">
            <Search className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-white">
            <Bell className="w-5 h-5" />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2">
                <Avatar className="w-8 h-8 border-2 border-white/20">
                  <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
              <DropdownMenuLabel className="flex items-center">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>Usuário</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Pagamento</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <Gauge className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="flex items-center cursor-pointer text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Featured Content Hero */}
        {featuredContent && (
          <div className="relative h-[80vh] md:min-h-[85vh]">
            <div className="absolute inset-0">
              <img 
                src={`https://images.unsplash.com/photo-1649972904349-6e44c42644a7`}
                alt={featuredContent.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-12 lg:p-16 max-w-2xl">
              <div className="mb-4">
                <span className="text-sm text-gray-300">Duração: 1h 47m</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-white font-bold">6.6</span>
                </div>
                <span className="text-sm text-gray-300">Action • Aventura • 2021</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{featuredContent.titulo}</h1>
              <p className="text-sm md:text-base mb-6 text-gray-300 line-clamp-3 md:line-clamp-4">
                {featuredContent.descricao || "When three different animals become infected with a dangerous pathogen, a primatologist and a geneticist team up to stop them from destroying Chicago."}
              </p>
              <div className="flex flex-wrap space-x-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white border-none rounded-md">
                  <Play className="mr-2 h-5 w-5" /> WATCH
                </Button>
                <Button size="lg" variant="outline" className="bg-gray-800/60 text-white border-gray-700 rounded-md">
                  <Plus className="mr-2 h-5 w-5" /> ADD LIST
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 md:px-8 py-8">
          {/* Content Categories */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className="text-xl md:text-2xl font-bold text-white">Trends Now</h2>
                <div className="ml-2 w-2 h-2 rounded-full bg-red-600"></div>
              </div>
              <div className="flex space-x-4">
                <Button variant="ghost" className="text-gray-400 hover:text-white">Popular</Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white">Premieres</Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white">Recently Added</Button>
              </div>
            </div>
            
            {/* Genre Pills */}
            <ScrollArea className="whitespace-nowrap pb-4">
              <div className="flex space-x-2 py-2">
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6">Action</Button>
                <Button variant="outline" className="text-white bg-gray-800/60 border-gray-700 hover:bg-gray-700 rounded-full px-6">Adventure</Button>
                <Button variant="outline" className="text-white bg-gray-800/60 border-gray-700 hover:bg-gray-700 rounded-full px-6">Animation</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6">Biography</Button>
                <Button variant="outline" className="text-white bg-gray-800/60 border-gray-700 hover:bg-gray-700 rounded-full px-6">Crime</Button>
                <Button variant="outline" className="text-white bg-gray-800/60 border-gray-700 hover:bg-gray-700 rounded-full px-6">Comedy</Button>
                <Button variant="outline" className="text-white bg-gray-800/60 border-gray-700 hover:bg-gray-700 rounded-full px-6">Documentary</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6">Drama</Button>
              </div>
            </ScrollArea>
          </div>

          {/* Trending Content Row */}
          <div className="mb-12">
            <ScrollArea className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {renderContentCards(trendingContent)}
              </div>
            </ScrollArea>
          </div>

          {/* Continue Watching */}
          {continueWatching.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold">Continue Watching</h2>
                <button className="text-sm text-gray-400 flex items-center">
                  See All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <ScrollArea className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {continueWatching.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-64 rounded-md overflow-hidden shadow-lg relative">
                      <Link to={`/watch/${item.conteudo?.id || item.episodio?.conteudo_id}`}>
                        <div className="relative">
                          <img 
                            src={`https://source.unsplash.com/random/300x450?movie,${item.conteudo?.titulo || item.episodio?.titulo}`} 
                            alt={item.conteudo?.titulo || item.episodio?.titulo}
                            className="w-full h-36 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                            <h3 className="text-white font-medium truncate">{item.conteudo?.titulo || item.episodio?.titulo}</h3>
                            {item.episodio && (
                              <p className="text-gray-300 text-sm">S{item.episodio.numero_temporada} E{item.episodio.numero_episodio}</p>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                            <div 
                              className="h-full bg-red-600" 
                              style={{ width: `${item.percentual_assistido}%` }} 
                            />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Content by Genre */}
          {genres.slice(0, 8).map((genre) => (
            <div key={genre.id} className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold">{genre.nome}</h2>
                <button className="text-sm text-gray-400 flex items-center">
                  See All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <ScrollArea className="overflow-x-auto">
                <div className="flex space-x-4 pb-4">
                  {contentByGenre[genre.id] ? 
                    renderContentCards(contentByGenre[genre.id]) : 
                    <p className="text-gray-400">Carregando conteúdos...</p>
                  }
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
