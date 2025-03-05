
import React, { useState, useEffect } from 'react';
import { contentAPI, userInteractionAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { ContentItem, Genre } from '@/types/api';
import { Header } from '@/components/ui/Header';
import { FeaturedContent } from '@/components/ui/FeaturedContent';
import { ContentRow } from '@/components/ui/ContentRow';
import { GenreFilter } from '@/components/ui/GenreFilter';
import { StreamingServicesRow } from '@/components/ui/StreamingServicesRow';

const Home = () => {
  const [featuredContent, setFeaturedContent] = useState<ContentItem | null>(null);
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContentItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [contentByGenre, setContentByGenre] = useState<{ [key: string]: ContentItem[] }>({});
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [topRatedContent, setTopRatedContent] = useState<ContentItem[]>([]);
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([]);
  const [activeGenres, setActiveGenres] = useState<string[]>(['1', '8']); // Default active genres
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useMobile();
  const isTV = window.innerWidth >= 1920;

  const toggleGenre = (genreId: string) => {
    setActiveGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get featured content
        const featuredData = await contentAPI.getFeatureContent();
        setFeaturedContent(featuredData);

        // Get trending content
        const trending = await contentAPI.getTrendingContent(20);
        setTrendingContent(trending);
        
        // Get recent content
        const recent = await contentAPI.getRecentContent(15);
        setRecentContent(recent);
        
        // Get top rated content
        const topRated = await contentAPI.getTopRatedContent(15);
        setTopRatedContent(topRated);

        // Get all genres
        const genresData = await contentAPI.getAllGenres();
        setGenres(genresData);

        // Get content by genre
        const contentGenres: { [key: string]: ContentItem[] } = {};
        for (const genre of genresData) {
          try {
            const content = await contentAPI.getContentByGenre(genre.id, 10);
            contentGenres[genre.id] = content;
          } catch (error) {
            console.error(`Error fetching content for genre ${genre.nome}:`, error);
            contentGenres[genre.id] = [];
          }
        }
        setContentByGenre(contentGenres);

        // Get continue watching content
        try {
          // This would need authenticated user in real app
          const userId = localStorage.getItem('userId') || 'mock-user';
          const watchingData = await userInteractionAPI.getContinueWatching(userId);
          setContinueWatching(watchingData);
          
          // Get recommended content
          const recommended = await userInteractionAPI.getRecommendedContent(userId);
          setRecommendedContent(recommended);
        } catch (error) {
          console.log('User not authenticated or error fetching user data:', error);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os conteúdos. Tente novamente mais tarde.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // If we're still loading and no featured content, show a loading state
  if (isLoading && !featuredContent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-700 rounded mb-8"></div>
          <div className="h-64 w-full max-w-4xl bg-gray-800 rounded-lg"></div>
          <div className="mt-8 grid grid-cols-4 gap-4 w-full max-w-4xl">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <div className="pt-16">
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

          {/* Streaming Services Row - Added new component here */}
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
      </div>
    </div>
  );
};

export default Home;
