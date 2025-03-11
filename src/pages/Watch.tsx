
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Plus,
  Info,
  X,
  Download,
  Subtitles,
  Languages,
  ChevronsUp,
  MoreHorizontal,
  Users,
  Clock,
  Flag,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ContentItem } from '@/types/api';
import { contentAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import { ContentRow } from '@/components/ui/ContentRow';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [relatedContent, setRelatedContent] = useState<ContentItem[]>([]);
  const [continuePlaying, setContinuePlaying] = useState<ContentItem[]>([]);
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isHovering, setIsHovering] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'1080p' | '720p' | '480p' | 'Auto'>('Auto');
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [subtitlesLanguage, setSubtitlesLanguage] = useState<'Português' | 'English' | 'Español'>('Português');
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState<'Original' | 'Português' | 'English'>('Original');
  const [isBuffering, setIsBuffering] = useState(false);
  const [showCastInfo, setShowCastInfo] = useState(false);
  const [progressHoverTime, setProgressHoverTime] = useState<number | null>(null);
  const [progressHoverPosition, setProgressHoverPosition] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await contentAPI.getContentById(id);
        setContent(data);
        
        // Mock data for related content
        const mockRelated = Array(8).fill(null).map((_, i) => ({
          id: `related-${i}`,
          tipo: Math.random() > 0.5 ? 'filme' : 'serie',
          titulo: `Título Relacionado ${i+1}`,
          descricao: 'Uma história relacionada ao conteúdo atual.',
          ano_lancamento: 2023,
          classificacao_etaria: '16',
          gratuito: false,
          poster_url: `https://source.unsplash.com/random/300x450?movie,${i}`,
          backdrop_url: `https://source.unsplash.com/random/1920x1080?movie,${i}`,
          duracao: '1h 45min',
          avaliacao: 4.5 + (Math.random() * 0.5),
          generos: ['Ação', 'Aventura']
        }));
        setRelatedContent(mockRelated);
        
        // Mock data for continue playing
        const mockContinue = Array(8).fill(null).map((_, i) => ({
          id: `continue-${i}`,
          tipo: Math.random() > 0.5 ? 'filme' : 'serie',
          titulo: `Continue Assistindo ${i+1}`,
          descricao: 'Continue de onde parou.',
          ano_lancamento: 2022,
          classificacao_etaria: '12',
          gratuito: false,
          poster_url: `https://source.unsplash.com/random/300x450?cinema,${i}`,
          backdrop_url: `https://source.unsplash.com/random/1920x1080?cinema,${i}`,
          duracao: '2h 05min',
          avaliacao: 4.0 + (Math.random() * 0.5),
          generos: ['Drama', 'Suspense']
        }));
        setContinuePlaying(mockContinue);
        
        // Mock data for trending
        const mockTrending = Array(8).fill(null).map((_, i) => ({
          id: `trending-${i}`,
          tipo: Math.random() > 0.5 ? 'filme' : 'serie',
          titulo: `Em Alta ${i+1}`,
          descricao: 'O que todos estão assistindo agora.',
          ano_lancamento: 2023,
          classificacao_etaria: '18',
          gratuito: false,
          poster_url: `https://source.unsplash.com/random/300x450?film,${i}`,
          backdrop_url: `https://source.unsplash.com/random/1920x1080?film,${i}`,
          duracao: '1h 30min',
          avaliacao: 4.7 + (Math.random() * 0.3),
          generos: ['Comédia', 'Romance']
        }));
        setTrendingContent(mockTrending);
        
        // Simulate player loading and playing
        setTimeout(() => {
          setDuration(7260); // 2h01m
          setIsBuffering(true);
          
          setTimeout(() => {
            setIsBuffering(false);
            setIsPlaying(true);
            
            // Increment timer for demo purposes
            const timerInterval = setInterval(() => {
              setCurrentTime(prev => {
                if (prev < duration) {
                  return prev + 1;
                } else {
                  clearInterval(timerInterval);
                  return prev;
                }
              });
            }, 1000);
            
            return () => clearInterval(timerInterval);
          }, 2000);
        }, 1500);
      } catch (error) {
        console.error('Error fetching content:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o conteúdo.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
    
    // Set up fullscreen change detection
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [id, toast]);

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isPlaying && !isHovering) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setShowControls(true));
      container.addEventListener('mouseleave', () => isPlaying && !isHovering && setShowControls(false));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(timeoutId);
    };
  }, [isPlaying, isHovering]);

  const togglePlay = () => {
    const iframe = document.querySelector<HTMLIFrameElement>('#youtube-player');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: isPlaying ? 'pauseVideo' : 'playVideo'
        }),
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const iframe = document.querySelector<HTMLIFrameElement>('#youtube-player');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: isMuted ? 'unMute' : 'mute'
        }),
        '*'
      );
      setIsMuted(!isMuted);
    }
  };

  const seekTo = (seconds: number) => {
    const iframe = document.querySelector<HTMLIFrameElement>('#youtube-player');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [seconds, true]
        }),
        '*'
      );
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleFullscreen = () => {
    if (playerContainerRef.current) {
      if (!document.fullscreenElement) {
        playerContainerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    const iframe = document.querySelector<HTMLIFrameElement>('#youtube-player');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'setVolume',
          args: [value[0]]
        }),
        '*'
      );
    }
    
    // If volume is set to 0, mute the video
    if (value[0] === 0 && !isMuted) {
      setIsMuted(true);
    }
    // If volume is increased from 0, unmute the video
    else if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const timePosition = position * duration;
      
      setProgressHoverPosition(e.clientX - rect.left);
      setProgressHoverTime(timePosition);
    }
  };
  
  const handleProgressLeave = () => {
    setProgressHoverTime(null);
    setProgressHoverPosition(null);
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const newTime = position * duration;
      
      seekTo(newTime);
      setCurrentTime(newTime);
    }
  };
  
  const captureClickOnControls = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const addToWatchlist = () => {
    toast({
      title: "Adicionado à sua lista",
      description: `${content?.titulo} foi adicionado à sua lista de desejos.`,
    });
  };
  
  const shareContent = () => {
    // In a real app, this would open a share dialog
    toast({
      title: "Compartilhar",
      description: `Link para ${content?.titulo} copiado para a área de transferência.`,
    });
  };
  
  const handleLike = () => {
    toast({
      title: "Gostei",
      description: "Sua avaliação foi registrada.",
    });
  };
  
  const handleDislike = () => {
    toast({
      title: "Não gostei",
      description: "Sua avaliação foi registrada.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-pulse w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"></div>
          <p className="text-white font-medium">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <p className="text-xl">Conteúdo não encontrado</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="text-white border-white hover:bg-white/20"
        >
          Voltar para Home
        </Button>
      </div>
    );
  }

  const videoId = content.video_url ? getYouTubeVideoId(content.video_url) : 'dQw4w9WgXcQ'; // Fallback video
  
  // Mock cast data
  const castMembers = [
    { name: "Sandra Bullock", role: "Protagonista", photo: "https://source.unsplash.com/random/100x100?woman,portrait,1" },
    { name: "Ryan Reynolds", role: "Coadjuvante", photo: "https://source.unsplash.com/random/100x100?man,portrait,1" },
    { name: "Keanu Reeves", role: "Antagonista", photo: "https://source.unsplash.com/random/100x100?man,portrait,2" },
    { name: "Viola Davis", role: "Participação Especial", photo: "https://source.unsplash.com/random/100x100?woman,portrait,2" },
  ];
  
  // Mock crew data
  const crewMembers = [
    { name: "Steven Spielberg", role: "Diretor" },
    { name: "Christopher Nolan", role: "Produtor" },
    { name: "J.J. Abrams", role: "Roteirista" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Container principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Player de Vídeo */}
        <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-black shadow-2xl mb-8">
          {/* Player e Controles */}
          <div ref={playerContainerRef} className="relative w-full h-full group">
            {videoId ? (
              <iframe
                id="youtube-player"
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playsinline=1&origin=${window.location.origin}`}
                title={content.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-zinc-900 to-zinc-800">
                <p className="text-lg sm:text-xl text-gray-400">Vídeo não disponível</p>
              </div>
            )}

            {/* Buffer/Loading spinner */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
              </div>
            )}

            {/* Overlay de gradiente para melhorar contraste */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Controles do player */}
            <AnimatePresence>
              {(showControls || isHovering) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex flex-col justify-between z-10 p-4 sm:p-6"
                  onClick={togglePlay}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {/* Cabeçalho - Título e botão voltar */}
                  <div className="flex items-center justify-between" onClick={captureClickOnControls}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(-1);
                      }}
                      className="text-white hover:bg-black/40 rounded-full"
                    >
                      <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                    
                    <h1 className="text-base sm:text-lg font-semibold text-white drop-shadow-md hidden sm:block">
                      {content.titulo}
                    </h1>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfo(!showInfo);
                      }}
                      className="text-white hover:bg-black/40 rounded-full"
                    >
                      <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                  </div>
                  
                  {/* Botão central de Play/Pause */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="icon"
                        className="bg-white/30 backdrop-blur-sm hover:bg-white/40 rounded-full w-16 h-16 sm:w-20 sm:h-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 sm:w-10 sm:h-10" />
                        ) : (
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Controles inferiores */}
                  <div className="space-y-2 sm:space-y-3" onClick={captureClickOnControls}>
                    {/* Barra de progresso com preview */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      {/* Preview tooltip */}
                      {progressHoverTime !== null && progressHoverPosition !== null && (
                        <div 
                          className="absolute bottom-full mb-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium transform -translate-x-1/2 pointer-events-none"
                          style={{ left: `${progressHoverPosition}px` }}
                        >
                          {formatTime(progressHoverTime)}
                          <div className="absolute w-2 h-2 bg-black/80 transform rotate-45 left-1/2 -translate-x-1/2 top-full -mt-1"></div>
                        </div>
                      )}
                      
                      {/* Barra de progresso */}
                      <div 
                        ref={progressBarRef}
                        className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer group"
                        onClick={handleProgressClick}
                        onMouseMove={handleProgressHover}
                        onMouseLeave={handleProgressLeave}
                      >
                        <div 
                          className="absolute inset-y-0 left-0 bg-red-600 rounded-full"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                        <div 
                          className="absolute h-4 w-4 -top-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}
                        />
                      </div>
                    </div>
                    
                    {/* Controles principais */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Botão Play/Pause */}
                        <Tooltip content={isPlaying ? "Pausar" : "Reproduzir"}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlay();
                            }}
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5" />
                            )}
                          </Button>
                        </Tooltip>
                        
                        {/* Botões de retroceder/avançar */}
                        <Tooltip content="Retroceder 10 segundos">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              seekTo(Math.max(0, currentTime - 10));
                              setCurrentTime(prev => Math.max(0, prev - 10));
                            }}
                          >
                            <SkipBack className="w-5 h-5" />
                          </Button>
                        </Tooltip>
                        
                        <Tooltip content="Avançar 10 segundos">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              seekTo(Math.min(duration, currentTime + 10));
                              setCurrentTime(prev => Math.min(duration, prev + 10));
                            }}
                          >
                            <SkipForward className="w-5 h-5" />
                          </Button>
                        </Tooltip>
                        
                        {/* Volume */}
                        <div className="relative">
                          <Tooltip content={isMuted ? "Ativar som" : "Silenciar"}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMute();
                              }}
                              onMouseEnter={() => setShowVolumeSlider(true)}
                              onMouseLeave={() => setShowVolumeSlider(false)}
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="w-5 h-5" />
                              ) : (
                                <Volume2 className="w-5 h-5" />
                              )}
                            </Button>
                          </Tooltip>
                          
                          {/* Slider de volume */}
                          <AnimatePresence>
                            {showVolumeSlider && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-4 bg-zinc-900/95 backdrop-blur-sm rounded-lg"
                                onMouseEnter={() => setShowVolumeSlider(true)}
                                onMouseLeave={() => setShowVolumeSlider(false)}
                              >
                                <div className="h-24">
                                  <Slider
                                    value={[volume]}
                                    max={100}
                                    step={1}
                                    orientation="vertical"
                                    onValueChange={handleVolumeChange}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Tempo */}
                        <span className="text-xs sm:text-sm text-white ml-1 hidden xs:inline-block">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      
                      {/* Controles secundários */}
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Legendas */}
                        <div className="relative">
                          <Tooltip content="Legendas">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "text-white hover:bg-white/10 rounded-full",
                                subtitlesEnabled && "text-red-500"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSubtitlesMenu(!showSubtitlesMenu);
                              }}
                            >
                              <Subtitles className="w-5 h-5" />
                            </Button>
                          </Tooltip>
                          
                          {/* Menu de legendas */}
                          <AnimatePresence>
                            {showSubtitlesMenu && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full right-0 mb-2 py-2 bg-zinc-900/95 backdrop-blur-sm rounded-lg border border-white/10 w-48"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-3 py-1 text-xs font-medium text-gray-400">
                                  Legendas
                                </div>
                                <button
                                  className={cn(
                                    "w-full px-3 py-2 text-sm text-left transition-colors flex items-center justify-between",
                                    !subtitlesEnabled ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
                                  )}
                                  onClick={() => {
                                    setSubtitlesEnabled(false);
                                    setShowSubtitlesMenu(false);
                                  }}
                                >
                                  Desativadas
                                  {!subtitlesEnabled && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                  )}
                                </button>
                                {['Português', 'English', 'Español'].map((lang) => (
                                  <button
                                    key={lang}
                                    className={cn(
                                      "w-full px-3 py-2 text-sm text-left transition-colors flex items-center justify-between",
                                      subtitlesEnabled && subtitlesLanguage === lang 
                                        ? "bg-white/10 text-white" 
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    )}
                                    onClick={() => {
                                      setSubtitlesEnabled(true);
                                      setSubtitlesLanguage(lang as any);
                                      setShowSubtitlesMenu(false);
                                    }}
                                  >
                                    {lang}
                                    {subtitlesEnabled && subtitlesLanguage === lang && (
                                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Áudio */}
                        <div className="relative">
                          <Tooltip content="Áudio">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAudioMenu(!showAudioMenu);
                              }}
                            >
                              <Languages className="w-5 h-5" />
                            </Button>
                          </Tooltip>
                          
                          {/* Menu de áudio */}
                          <AnimatePresence>
                            {showAudioMenu && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full right-0 mb-2 py-2 bg-zinc-900/95 backdrop-blur-sm rounded-lg border border-white/10 w-48"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-3 py-1 text-xs font-medium text-gray-400">
                                  Áudio
                                </div>
                                {['Original', 'Português', 'English'].map((lang) => (
                                  <button
                                    key={lang}
                                    className={cn(
                                      "w-full px-3 py-2 text-sm text-left transition-colors flex items-center justify-between",
                                      audioLanguage === lang 
                                        ? "bg-white/10 text-white" 
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    )}
                                    onClick={() => {
                                      setAudioLanguage(lang as any);
                                      setShowAudioMenu(false);
                                    }}
                                  >
                                    {lang}
                                    {audioLanguage === lang && (
                                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Qualidade */}
                        <div className="relative">
                          <Tooltip content="Configurações">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowQualityMenu(!showQualityMenu);
                              }}
                            >
                              <Settings className="w-5 h-5" />
                            </Button>
                          </Tooltip>
                          
                          {/* Menu de qualidade */}
                          <AnimatePresence>
                            {showQualityMenu && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full right-0 mb-2 py-2 bg-zinc-900/95 backdrop-blur-sm rounded-lg border border-white/10 w-48"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-3 py-1 text-xs font-medium text-gray-400">
                                  Qualidade
                                </div>
                                {['Auto', '1080p', '720p', '480p'].map((quality) => (
                                  <button
                                    key={quality}
                                    className={cn(
                                      "w-full px-3 py-2 text-sm text-left transition-colors flex items-center justify-between",
                                      videoQuality === quality 
                                        ? "bg-white/10 text-white" 
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    )}
                                    onClick={() => {
                                      setVideoQuality(quality as any);
                                      setShowQualityMenu(false);
                                    }}
                                  >
                                    {quality}
                                    {videoQuality === quality && (
                                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Tela cheia */}
                        <Tooltip content={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFullscreen();
                            }}
                          >
                            <Maximize className="w-5 h-5" />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Informações do Conteúdo e Painel de Interação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Coluna esquerda - Informações principais */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-zinc-900/70 backdrop-blur-sm rounded-lg p-5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{content.titulo}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-300">
                    <span className="bg-red-600 px-1.5 py-0.5 rounded text-white text-xs">
                      {content.classificacao_etaria}
                    </span>
                    <span>{content.ano_lancamento}</span>
                    <span>•</span>
                    <span>{content.duracao || "2h 01m"}</span>
                    <span>•</span>
                    <span className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">
                      {content.tipo === 'filme' ? 'FILME' : 'SÉRIE'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleLike}
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </Button>
                  
                  <Button 
                    onClick={handleDislike}
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </Button>
                  
                  <Button 
                    onClick={addToWatchlist}
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                  
                  <Button 
                    onClick={shareContent}
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Descrição */}
              <div className="mb-6">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {content.descricao || "Esta é uma história emocionante que vai te prender do início ao fim. Uma jornada épica de aventura, descoberta e emoção, com personagens inesquecíveis e reviravoltas surpreendentes. Prepare-se para uma experiência única que vai te fazer rir, chorar e refletir."}
                </p>
              </div>
              
              {/* Metadados adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gêneros */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Gêneros</h3>
                  <div className="flex flex-wrap gap-2">
                    {(content.generos || ['Ação', 'Drama', 'Suspense']).map((genero) => (
                      <span 
                        key={genero} 
                        className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-gray-300"
                      >
                        {genero}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Equipe */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Equipe</h3>
                  <ul className="text-sm text-gray-300">
                    {crewMembers.map((member, index) => (
                      <li key={index} className="mb-1">
                        <span className="text-gray-400">{member.role}:</span> {member.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coluna direita - Elenco */}
          <div className="col-span-1">
            <div className="bg-zinc-900/70 backdrop-blur-sm rounded-lg p-5 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Elenco Principal</h3>
              
              <div className="space-y-4">
                {castMembers.map((actor, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img 
                      src={actor.photo} 
                      alt={actor.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{actor.name}</p>
                      <p className="text-sm text-gray-400">{actor.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full text-sm bg-transparent border-white/20 hover:bg-white/10"
                  onClick={() => setShowCastInfo(!showCastInfo)}
                >
                  {showCastInfo ? "Ver menos" : "Ver elenco completo"}
                  <ChevronsUp className={`ml-2 w-4 h-4 transition-transform ${showCastInfo ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              {/* Informações extras para streaming */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400 w-4 h-4" />
                    <span className="text-sm">Lançamento: {content.ano_lancamento}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-400 w-4 h-4" />
                    <span className="text-sm">Duração: {content.duracao || "2h 01m"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-gray-400 w-4 h-4" />
                    <span className="text-sm">Classificação: {content.classificacao_etaria}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="text-gray-400 w-4 h-4" />
                    <span className="text-sm">Disponível para download</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção de Carrosséis */}
        <div className="space-y-8 sm:space-y-12">
          {/* Continuar Assistindo */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Continuar Assistindo</h2>
            <ContentRow 
              title="" 
              content={continuePlaying}
            />
          </section>
          
          {/* Recomendados para você */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Recomendados para Você</h2>
            <ContentRow 
              title="" 
              content={relatedContent}
            />
          </section>
          
          {/* Em Alta */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Em Alta</h2>
            <ContentRow 
              title="" 
              content={trendingContent}
            />
          </section>
        </div>
      </div>
      
      {/* Botão de Voltar Flutuante */}
      <Button 
        variant="ghost" 
        size="icon"
        className="fixed top-4 left-4 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 lg:hidden z-50"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Watch;
