import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Baby, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentRow } from '@/components/ui/ContentRow';
import { contentAPI } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useMobile } from '@/hooks/use-mobile';
import { BottomNav } from '@/components/ui/BottomNav';

const kidsGenres = ['9', '2']; // Animation and Adventure IDs from our genres

const KidsHeader = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-purple-900/90 to-transparent">
      <div className="w-full px-3 sm:px-4 lg:px-6 h-12 sm:h-14 lg:h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            className="mr-2 text-white h-8 w-8" 
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex items-center">
            <Baby className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 text-white" />
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white">CinePlay Kids</h1>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="text-white h-8 w-8">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

const Kids = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  
  // Fetch animation content
  const { data: animationContent, isLoading: isLoadingAnimation } = useQuery({
    queryKey: ['kidsContent', 'animation'],
    queryFn: () => contentAPI.getContentByGenre(kidsGenres[0], 10)
  });
  
  // Fetch adventure content
  const { data: adventureContent, isLoading: isLoadingAdventure } = useQuery({
    queryKey: ['kidsContent', 'adventure'],
    queryFn: () => contentAPI.getContentByGenre(kidsGenres[1], 10)
  });
  
  // Fetch recent kids content
  const { data: recentContent, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['kidsContent', 'recent'],
    queryFn: () => contentAPI.getRecentContent(10)
  });

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <KidsHeader />

      {/* Hero Banner for Kids */}
      <div className="relative pt-12 sm:pt-14 lg:pt-16">
        <div className="h-[220px] sm:h-[280px] lg:h-[480px]">
          <img 
            src="https://via.placeholder.com/1200x400" 
            alt="Kids content" 
            className="w-full h-full object-cover"
          />
          {/* Gradiente para o header */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-900/30 to-transparent" />
          {/* Gradiente para o texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-purple-900/50 to-transparent" />
        </div>
        
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 lg:p-6">
          <div className="container mx-auto">
            <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
              Bem-vindo ao CinePlay Kids!
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-md line-clamp-2 lg:line-clamp-none">
              Um espaço seguro com conteúdo divertido e educativo para crianças de todas as idades.
            </p>
          </div>
        </div>
      </div>
      
      <main className="pb-16 sm:pb-20">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 mt-4 sm:mt-6 lg:mt-8">
          {/* Animation Content */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
              Animações
            </h2>
            {isLoadingAnimation ? (
              <div className="flex justify-center items-center h-20 sm:h-24 lg:h-32">
                <p className="text-white">Carregando...</p>
              </div>
            ) : (
              <ContentRow 
                title="Animações"
                content={animationContent || []}
              />
            )}
          </div>
          
          {/* Adventure Content */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
              Aventuras
            </h2>
            {isLoadingAdventure ? (
              <div className="flex justify-center items-center h-20 sm:h-24 lg:h-32">
                <p className="text-white">Carregando...</p>
              </div>
            ) : (
              <ContentRow 
                title="Aventuras"
                content={adventureContent || []}
              />
            )}
          </div>
          
          {/* Recent Kids Content */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
              Adicionados recentemente
            </h2>
            {isLoadingRecent ? (
              <div className="flex justify-center items-center h-20 sm:h-24 lg:h-32">
                <p className="text-white">Carregando...</p>
              </div>
            ) : (
              <ContentRow 
                title="Recentes"
                content={recentContent || []}
              />
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      {isMobile && <BottomNav />}
    </motion.div>
  );
};

export default Kids;
