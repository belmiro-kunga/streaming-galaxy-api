
import React, { useState } from 'react';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';
import { useVideoSource } from '@/hooks/use-video-source';
import { Loader2, Info, Subtitles, Film } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Skeleton } from './skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { ContentItem } from '@/types/api';
import { Button } from './button';

interface VideoContentDisplayProps {
  content: ContentItem;
  relatedContent?: ContentItem[];
  onContentChange?: (content: ContentItem) => void;
  isPremiumUser?: boolean;
}

export function VideoContentDisplay({ 
  content, 
  relatedContent = [], 
  onContentChange,
  isPremiumUser = true
}: VideoContentDisplayProps) {
  const [selectedTab, setSelectedTab] = useState<string>('video');
  const [watchTime, setWatchTime] = useState<number>(0);
  
  // Determine video URL based on content
  const videoUrl = 
    content.video_url_1080p || 
    content.video_url_720p || 
    content.video_url_480p || 
    content.video_url || 
    (content.trailer_url || '');
  
  const { 
    isLoading, 
    error, 
    getPlayerOptions 
  } = useVideoSource(videoUrl, content.id);
  
  const playerOptions = getPlayerOptions();
  
  // Format content type for display
  const formatContentType = (type: string) => {
    switch (type) {
      case 'filme':
        return 'Filme';
      case 'serie':
        return 'Série';
      case 'documentario':
        return 'Documentário';
      default:
        return type;
    }
  };
  
  // Handle watch progress
  const handleProgress = (state: { 
    played: number; 
    playedSeconds: number; 
    loaded: number; 
    loadedSeconds: number 
  }) => {
    setWatchTime(state.playedSeconds);
    
    // You would typically save this to your backend
    if (state.played > 0.1 && state.played % 0.1 < 0.01) {
      console.log(`Progress update: ${Math.round(state.played * 100)}% - ${Math.round(state.playedSeconds)}s`);
      // Save to backend here
    }
  };
  
  // When content ends
  const handleEnded = () => {
    console.log("Content playback ended");
    // You could automatically play the next episode/related content here
  };
  
  return (
    <div className="flex flex-col w-full">
      {/* Video Player Section */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-6">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-4">
            <Film className="h-16 w-16 text-gray-700 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Erro ao carregar o conteúdo</h3>
            <p className="text-gray-400 text-center max-w-md mb-4">{error}</p>
            <Button variant="default" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        ) : !isPremiumUser && !content.gratuito ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-4">
            <div className="bg-primary/20 p-5 rounded-full mb-4">
              <Info className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Conteúdo Premium</h3>
            <p className="text-gray-400 text-center max-w-md mb-4">
              Este conteúdo é exclusivo para assinantes. Assine um plano para continuar assistindo.
            </p>
            <Button variant="default">
              Ver Planos
            </Button>
          </div>
        ) : (
          <UniversalVideoPlayer
            url={playerOptions.url}
            qualityOptions={playerOptions.qualityOptions}
            subtitles={playerOptions.subtitles}
            title={content.titulo}
            subtitle={formatContentType(content.tipo)}
            poster={content.poster_url}
            onProgress={handleProgress}
            onEnded={handleEnded}
            className="w-full aspect-video"
          />
        )}
      </div>
      
      {/* Content Information Tabs */}
      <Tabs defaultValue="info" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="episodes">
            {content.tipo === 'serie' ? 'Episódios' : 'Extras'}
          </TabsTrigger>
          <TabsTrigger value="related">Recomendados</TabsTrigger>
        </TabsList>
        
        {/* Info Tab */}
        <TabsContent value="info" className="py-4">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Poster Image */}
              <div className="w-40 flex-shrink-0">
                {content.poster_url ? (
                  <img 
                    src={content.poster_url} 
                    alt={content.titulo} 
                    className="w-full h-auto rounded-md shadow-md"
                  />
                ) : (
                  <Skeleton className="w-full aspect-[2/3] rounded-md" />
                )}
              </div>
              
              {/* Content Details */}
              <div className="flex-grow">
                <h1 className="text-2xl font-bold mb-2">{content.titulo}</h1>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {content.gratuito ? (
                    <Badge className="bg-green-600">Gratuito</Badge>
                  ) : (
                    <Badge className="bg-purple-600">Premium</Badge>
                  )}
                  
                  <Badge variant="outline">{content.ano_lancamento}</Badge>
                  
                  {content.classificacao_etaria && (
                    <Badge variant="secondary">{content.classificacao_etaria} anos</Badge>
                  )}
                  
                  {content.duracao && (
                    <Badge variant="outline">{content.duracao}</Badge>
                  )}
                </div>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {content.generos?.map((genero, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-gray-800 text-white border-gray-700"
                    >
                      {typeof genero === 'string' ? genero : genero.nome}
                    </Badge>
                  ))}
                </div>
                
                {/* Description */}
                <p className="text-gray-300 mb-4">{content.descricao}</p>
                
                {/* Metadata */}
                {content.metadata && (
                  <div className="space-y-2 text-sm text-gray-400">
                    {content.metadata.diretor && (
                      <p><span className="font-medium">Diretor:</span> {content.metadata.diretor}</p>
                    )}
                    
                    {content.metadata.elenco && (
                      <p><span className="font-medium">Elenco:</span> {content.metadata.elenco}</p>
                    )}
                    
                    {content.metadata.origem && (
                      <p><span className="font-medium">Origem:</span> {content.metadata.origem}</p>
                    )}
                    
                    {content.metadata.diretorio && (
                      <p><span className="font-medium">Disponível em:</span> {content.metadata.diretorio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Episodes Tab */}
        <TabsContent value="episodes" className="py-4">
          {content.tipo === 'serie' && content.metadata?.episodios?.length ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {content.metadata.temporada ? `Temporada ${content.metadata.temporada}` : 'Episódios'}
              </h2>
              
              <div className="grid grid-cols-1 gap-3">
                {content.metadata.episodios.map((episodio, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          {episodio.numero_episodio}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{episodio.titulo}</h4>
                          {episodio.duracao && (
                            <p className="text-sm text-gray-400">{episodio.duracao}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon">
                          <Play className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <Subtitles className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum episódio ou conteúdo extra disponível.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Related Content Tab */}
        <TabsContent value="related" className="py-4">
          {relatedContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedContent.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => onContentChange && onContentChange(item)}
                >
                  <div className="aspect-video relative">
                    <img 
                      src={item.poster_url || `https://source.unsplash.com/random/300x450?movie,${item.titulo}`} 
                      alt={item.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-red-600">{formatContentType(item.tipo)}</Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-3">
                    <h3 className="font-medium line-clamp-1">{item.titulo}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                      <span>{item.ano_lancamento}</span>
                      {item.duracao && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                          <span>{item.duracao}</span>
                        </>
                      )}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <Film className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum conteúdo relacionado disponível.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
