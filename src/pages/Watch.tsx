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
  Cog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ContentItem } from '@/types/api';
import { contentAPI } from '@/services/api';
import { cn } from '@/lib/utils';

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem | null>(null);
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
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [videoQuality, setVideoQuality] = useState<'720p' | '1080p' | '480p'>('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);

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
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  // Função para extrair o ID do vídeo do YouTube da URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setShowControls(true));
      container.addEventListener('mouseleave', () => isPlaying && setShowControls(false));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      clearTimeout(timeoutId);
    };
  }, [isPlaying]);

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
    return `${hours > 0 ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"></div>
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

  const videoId = content.video_url ? getYouTubeVideoId(content.video_url) : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Container principal com padding responsivo */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Área do Player */}
        <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-black shadow-2xl">
          {/* Player do YouTube */}
          <div ref={playerContainerRef} className="relative w-full h-full">
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
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-base sm:text-xl text-gray-400">Vídeo não disponível</p>
              </div>
            )}

            {/* Gradientes de sobreposição */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none" />

            {/* Controles do player responsivos */}
            <div 
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300",
                (showControls || isHovering) ? "opacity-100" : "opacity-0"
              )}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Área clicável para play/pause */}
              <button 
                className="absolute inset-0 w-full h-full z-10"
                onClick={togglePlay}
              />

              {/* Overlay de gradiente para melhor visibilidade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/60" />

              {/* Ícone central de play/pause */}
              <div className="relative z-20 transform transition-transform duration-200 hover:scale-110">
                {isPlaying ? (
                  <Pause className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
                ) : (
                  <Play className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 ml-2" />
                )}
              </div>

              {/* Controles de navegação */}
              <div className="absolute bottom-4 left-0 right-0 px-4 z-20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Tempo atual */}
                    <span className="text-sm sm:text-base text-white/90">
                      {formatTime(currentTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4">
                    {/* Botões de controle */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        seekTo(currentTime - 10);
                      }}
                    >
                      <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        seekTo(currentTime + 10);
                      }}
                    >
                      <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    {/* Volume */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                      >
                        {isMuted ? 
                          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        }
                      </Button>
                      {showVolumeSlider && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-4 bg-zinc-900/95 backdrop-blur-sm rounded-lg">
                          <div className="h-24">
                            <Slider
                              value={[volume]}
                              max={100}
                              step={1}
                              orientation="vertical"
                              onValueChange={handleVolumeChange}
                            />
                </div>
            </div>
          )}
        </div>
        
                    {/* Tempo total */}
                    <span className="text-sm sm:text-base text-white/90">
                      {formatTime(duration)}
                    </span>

                    {/* Tela cheia */}
          <Button 
            variant="ghost" 
                      size="icon"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen();
                      }}
                    >
                      <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
                  </div>
        </div>
        
                {/* Barra de progresso */}
                <div 
                  className="mt-2 relative w-full h-1 bg-white/20 rounded-full cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    seekTo(percent * duration);
                  }}
                >
                  <div 
                    className="absolute inset-y-0 left-0 bg-red-600 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  <div 
                    className="absolute h-3 w-3 -top-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${(currentTime / duration) * 100}% - 6px)` }}
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
          
        {/* Barra de Controles Externa */}
        <div className="bg-zinc-900/95 backdrop-blur-sm rounded-lg mt-4 p-4">
          <div className="flex items-center justify-between">
            {/* Controles de Reprodução */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                onClick={() => seekTo(currentTime - 10)}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                onClick={togglePlay}
              >
                {isPlaying ? 
                  <Pause className="w-5 h-5" /> : 
                  <Play className="w-5 h-5 ml-0.5" />
                }
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                onClick={() => seekTo(currentTime + 10)}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              
              {/* Volume */}
              <div className="relative">
              <Button 
                variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                {showVolumeSlider && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-4 bg-zinc-900/95 backdrop-blur-sm rounded-lg">
                    <div className="h-24">
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        orientation="vertical"
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tempo */}
              <span className="text-sm text-gray-400 ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            {/* Controles Secundários */}
            <div className="flex items-center gap-2">
              {/* Download */}
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                onClick={() => window.open(content.video_url, '_blank')}
              >
                <Download className="w-5 h-5" />
              </Button>
              
              {/* Qualidade */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 rounded-lg h-10 px-3 flex items-center gap-2"
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                >
                  <span className="text-sm font-medium">{videoQuality}</span>
                  <Cog className="w-4 h-4" />
                </Button>
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 py-2 bg-zinc-900/95 backdrop-blur-sm rounded-lg min-w-[120px] border border-white/10">
                    {['1080p', '720p', '480p'].map((quality) => (
                      <button
                        key={quality}
                        className={cn(
                          "w-full px-4 py-2 text-sm text-left transition-colors",
                          videoQuality === quality 
                            ? "bg-white/10 text-white" 
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        )}
                        onClick={() => {
                          setVideoQuality(quality as '720p' | '1080p' | '480p');
                          setShowQualityMenu(false);
                        }}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tela Cheia */}
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10"
                onClick={toggleFullscreen}
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-4">
            <div 
              className="relative w-full h-1 bg-white/20 rounded-full cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                seekTo(percent * duration);
              }}
            >
              <div 
                className="absolute inset-y-0 left-0 bg-red-600 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <div className="absolute h-2 w-2 bg-red-600 rounded-full -mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controles Externos Responsivos */}
        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
          {/* Título e Metadados */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{content.titulo}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-400">
                <span>{content.ano_lancamento}</span>
                <span className="hidden sm:inline">•</span>
                <span>{content.duracao}</span>
                <span className="hidden sm:inline">•</span>
                <span>{content.classificacao_etaria}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10 sm:w-11 sm:h-11"
              >
                <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10 sm:w-11 sm:h-11"
              >
                <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10 sm:w-11 sm:h-11"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-10 h-10 sm:w-11 sm:h-11"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Descrição */}
          <div className="max-w-3xl">
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {content.descricao}
            </p>
          </div>

          {/* Gêneros */}
          {content.generos && content.generos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-400">Gêneros</h3>
              <div className="flex flex-wrap gap-2">
                {content.generos.map((genero) => (
                  <span 
                    key={genero} 
                    className="px-2 sm:px-3 py-1 bg-zinc-800 rounded-full text-xs sm:text-sm text-gray-300"
                  >
                    {genero}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Botão de Voltar Responsivo */}
      <Button 
        variant="ghost" 
        size="icon"
        className="fixed top-4 sm:top-6 left-4 sm:left-6 text-white hover:bg-white/10 rounded-full w-10 h-10 sm:w-12 sm:h-12"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>
    </div>
  );
};

export default Watch;

