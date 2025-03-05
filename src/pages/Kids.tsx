
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Baby, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentRow } from '@/components/ui/ContentRow';
import { contentAPI } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useMobile } from '@/hooks/use-mobile';

const kidsGenres = ['9', '2']; // Animation and Adventure IDs from our genres

const KidsHeader = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  
  return (
    <header className="relative z-10 py-4 px-6 flex items-center justify-between bg-gradient-to-b from-purple-600/90 to-purple-600/10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 text-white" 
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center">
          <Baby className="h-7 w-7 mr-2 text-white" />
          <h1 className="text-2xl font-bold text-white">CinePlay Kids</h1>
        </div>
      </div>
      
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="text-white">
          <Search className="h-6 w-6" />
        </Button>
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
      className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 pb-20 md:pb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <KidsHeader />
      
      <main className="container mx-auto px-4 pt-4 pb-24">
        {/* Hero Banner for Kids */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/80 to-transparent z-10"></div>
          <img 
            src="https://via.placeholder.com/1200x400" 
            alt="Kids content" 
            className="w-full h-40 md:h-80 object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">Bem-vindo ao CinePlay Kids!</h2>
            <p className="text-sm md:text-lg text-white/90 max-w-md">
              Um espaço seguro com conteúdo divertido e educativo para crianças de todas as idades.
            </p>
          </div>
        </div>
        
        {/* Animation Content */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Animações</h2>
          {isLoadingAnimation ? (
            <div className="flex justify-center items-center h-32">
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
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Aventuras</h2>
          {isLoadingAdventure ? (
            <div className="flex justify-center items-center h-32">
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
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Adicionados recentemente</h2>
          {isLoadingRecent ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-white">Carregando...</p>
            </div>
          ) : (
            <ContentRow 
              title="Recentes"
              content={recentContent || []}
            />
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default Kids;
