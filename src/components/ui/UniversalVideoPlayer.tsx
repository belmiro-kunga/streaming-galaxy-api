
import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Loader2, Subtitles } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './dropdown-menu';

interface UniversalVideoPlayerProps {
  url: string;
  title?: string;
  subtitle?: string;
  poster?: string;
  subtitles?: Array<{
    src: string;
    label: string;
    language: string;
  }>;
  qualityOptions?: Array<{
    label: string;
    src: string;
  }>;
  onEnded?: () => void;
  onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  autoplay?: boolean;
  className?: string;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
  url,
  title,
  subtitle,
  poster,
  subtitles = [],
  qualityOptions = [],
  onEnded,
  onProgress,
  autoplay = false,
  className = '',
}) => {
  const [playing, setPlaying] = useState(autoplay);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const videoUrl = qualityOptions.find(option => option.label === selectedQuality)?.src || url;
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const pad = (num: number) => (num < 10 ? `0${num}` : num.toString());
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    return h > 0 
      ? `${h}:${pad(m)}:${pad(s)}` 
      : `${m}:${pad(s)}`;
  };
  
  // Toggle play/pause
  const handlePlayPause = () => setPlaying(!playing);
  
  // Toggle mute
  const handleMute = () => setMuted(!muted);
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
  };
  
  // Handle progress updates
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
    }
    
    if (onProgress) {
      onProgress(state);
    }
  };
  
  // Handle seeking
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };
  
  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0]);
  };
  
  const handleSeekMouseUp = (value: number[]) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(value[0]);
    }
  };
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error('Erro ao entrar em tela cheia:', err));
      }
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error('Erro ao sair da tela cheia:', err));
    }
  };
  
  // Hide controls after inactivity
  const hideControls = () => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    
    controlsTimerRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // Show controls on mouse move/touch
  const showControlsOnInteraction = () => {
    setShowControls(true);
    hideControls();
  };
  
  // Handle quality selection
  const handleQualityChange = (quality: string) => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    setSelectedQuality(quality);
    
    // We'll seek to the current time after quality change
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime);
      }
    }, 500);
  };
  
  // Handle subtitle selection
  const handleSubtitleChange = (src: string | null) => {
    setActiveSubtitle(src);
  };
  
  // Clean up timers
  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);
  
  // Set up fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Hide controls when playing
  useEffect(() => {
    if (playing) {
      hideControls();
    } else {
      setShowControls(true);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    }
  }, [playing]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-black rounded-lg ${className}`}
      onMouseMove={showControlsOnInteraction}
      onTouchStart={showControlsOnInteraction}
    >
      {/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={playing}
        volume={volume}
        muted={muted}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        progressInterval={500}
        onProgress={handleProgress}
        onDuration={setDuration}
        onEnded={onEnded}
        onBuffer={() => setLoading(true)}
        onBufferEnd={() => setLoading(false)}
        onReady={() => setLoading(false)}
        onError={(e) => {
          console.error('Video playback error:', e);
          setError(true);
          setLoading(false);
        }}
        config={{
          file: {
            attributes: {
              poster: poster,
              crossOrigin: "anonymous",
            },
            tracks: subtitles.map(subtitle => ({
              kind: 'subtitles',
              src: subtitle.src,
              srcLang: subtitle.language,
              label: subtitle.label,
              default: activeSubtitle === subtitle.src
            })),
          },
          youtube: {
            playerVars: { 
              modestbranding: 1,
              rel: 0
            }
          }
        }}
      />
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 p-4">
          <h3 className="text-xl text-red-500 font-medium mb-2">Erro na reprodução</h3>
          <p className="text-white text-center mb-4">Não foi possível reproduzir este vídeo.</p>
          <Button 
            variant="default" 
            onClick={() => {
              setError(false);
              setLoading(true);
              // Attempt to reload the player
              const currentSrc = videoUrl;
              // Force a reload by briefly changing the src
              setTimeout(() => {
                if (playerRef.current) {
                  playerRef.current.seekTo(0);
                }
              }, 300);
            }}
          >
            Tentar novamente
          </Button>
        </div>
      )}
      
      {/* Title overlay */}
      {title && showControls && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
          <h3 className="text-white font-medium text-lg">{title}</h3>
          {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
        </div>
      )}
      
      {/* Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 z-10 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress bar */}
        <div className="mb-2">
          <Slider
            defaultValue={[0]}
            value={[played]}
            max={1}
            step={0.001}
            onValueChange={handleSeekChange}
            onValueCommit={handleSeekMouseUp}
            onPointerDown={handleSeekMouseDown}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/80 mt-1">
            <span>{formatTime(duration * played)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <div className="hidden sm:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleMute}
                className="text-white hover:bg-white/20"
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Slider
                defaultValue={[0.5]}
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Subtitles dropdown */}
            {subtitles.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Subtitles className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-900 text-white border-gray-700">
                  <DropdownMenuItem 
                    onClick={() => handleSubtitleChange(null)}
                    className={!activeSubtitle ? "bg-primary/20" : ""}
                  >
                    Desativado
                    {!activeSubtitle && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  
                  {subtitles.map((subtitle) => (
                    <DropdownMenuItem 
                      key={subtitle.src}
                      onClick={() => handleSubtitleChange(subtitle.src)}
                      className={activeSubtitle === subtitle.src ? "bg-primary/20" : ""}
                    >
                      {subtitle.label}
                      {activeSubtitle === subtitle.src && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Quality selector */}
            {qualityOptions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 bg-gray-900 text-white border-gray-700">
                  <DropdownMenuItem 
                    onClick={() => handleQualityChange('auto')}
                    className={selectedQuality === 'auto' ? "bg-primary/20" : ""}
                  >
                    Auto
                    {selectedQuality === 'auto' && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  
                  {qualityOptions.map((quality) => (
                    <DropdownMenuItem 
                      key={quality.label}
                      onClick={() => handleQualityChange(quality.label)}
                      className={selectedQuality === quality.label ? "bg-primary/20" : ""}
                    >
                      {quality.label}
                      {selectedQuality === quality.label && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Fullscreen button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
