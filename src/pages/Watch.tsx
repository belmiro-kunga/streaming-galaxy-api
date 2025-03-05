
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  ThumbsUp, 
  Plus, 
  VolumeX, 
  Volume2, 
  Maximize, 
  Settings,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Subtitles
} from 'lucide-react';
import { ContentItem } from '@/types/api';
import { contentAPI } from '@/services/api';
import { useMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTVMode, setIsTVMode] = useState(false);
  const [focusedControl, setFocusedControl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for TV mode based on screen size
  useEffect(() => {
    const checkTVMode = () => {
      // Screen wider than 1920px is likely a large TV
      setIsTVMode(window.innerWidth >= 1920);
    };
    
    checkTVMode();
    window.addEventListener('resize', checkTVMode);
    
    return () => window.removeEventListener('resize', checkTVMode);
  }, []);
  
  // Handle keyboard navigation for TV remote compatibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTVMode) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          handleArrowNavigation(e.key);
          break;
        case 'Enter':
          handleEnterKey();
          break;
        case 'Escape':
        case 'Backspace':
          navigate('/home');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTVMode, focusedControl, navigate]);
  
  const handleArrowNavigation = (key: string) => {
    // Simple focus navigation between controls
    const controls = ['play', 'back', 'forward', 'volume', 'settings', 'fullscreen'];
    const currentIndex = focusedControl ? controls.indexOf(focusedControl) : -1;
    
    let newIndex = currentIndex;
    
    if (key === 'ArrowRight') {
      newIndex = currentIndex < controls.length - 1 ? currentIndex + 1 : 0;
    } else if (key === 'ArrowLeft') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : controls.length - 1;
    } else if (key === 'ArrowUp' || key === 'ArrowDown') {
      // Toggle play/pause on up/down when on play button
      if (focusedControl === 'play') {
        togglePlayPause();
      }
      // Adjust volume when on volume button
      if (focusedControl === 'volume') {
        setIsMuted(prev => !prev);
      }
    }
    
    setFocusedControl(controls[newIndex]);
  };
  
  const handleEnterKey = () => {
    switch (focusedControl) {
      case 'play':
        togglePlayPause();
        break;
      case 'volume':
        setIsMuted(prev => !prev);
        break;
      case 'back':
        navigate('/home');
        break;
      case 'settings':
        toast({
          title: "Configurações",
          description: "Menu de configurações aberto",
        });
        break;
      case 'fullscreen':
        toggleFullscreen();
        break;
      default:
        break;
    }
  };
  
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch the specific content by ID
        // For now, we'll use the featured content as a placeholder
        const data = await contentAPI.getFeatureContent();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContent();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Conteúdo não encontrado</h1>
        <Link to="/home" className="text-red-600 hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Video Player */}
      <div className="relative w-full h-screen">
        {/* Video placeholder - in real implementation, this would be a video element */}
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <img 
            src={`https://source.unsplash.com/random/1920x1080?movie,${content.titulo}`}
            alt={content.titulo}
            className="w-full h-full object-cover"
          />
          
          {/* Play button overlay - visible when paused */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
              onClick={togglePlayPause}
            >
              <button 
                className={`w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ${focusedControl === 'play' && isTVMode ? 'ring-4 ring-white' : ''}`}
                onClick={togglePlayPause}
                data-control="play"
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </button>
            </div>
          )}
        </div>
        
        {/* Hidden actual video element for real functionality */}
        <video 
          ref={videoRef} 
          className="hidden" 
          onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          muted={isMuted}
        />
        
        {/* Player controls */}
        <div className="absolute inset-x-0 top-0 p-4 flex items-center">
          <Button 
            variant="ghost" 
            className={`text-white hover:bg-white/10 rounded-full p-2 ${focusedControl === 'back' && isTVMode ? 'ring-2 ring-white' : ''}`}
            onClick={() => navigate('/home')}
            data-control="back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="ml-4 text-xl font-bold">{content.titulo}</h1>
        </div>
        
        <div 
          ref={controlsRef}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-6 px-4"
        >
          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-600 rounded-full mb-4">
            <div 
              className="h-full bg-red-600 rounded-full"
              style={{ width: `${(currentTime / (videoRef.current?.duration || 100)) * 100}%` }}
            ></div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className={`text-white hover:bg-white/10 rounded-full p-2 ${focusedControl === 'play' && isTVMode ? 'ring-2 ring-white' : ''}`}
                onClick={togglePlayPause}
                data-control="play"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
              
              {/* Skip back 10s */}
              <Button 
                variant="ghost" 
                className={`text-white hover:bg-white/10 rounded-full p-2 ${focusedControl === 'back10' && isTVMode ? 'ring-2 ring-white' : ''}`}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
                  }
                }}
                data-control="back10"
              >
                <SkipBack className="w-6 h-6" />
              </Button>
              
              {/* Skip forward 10s */}
              <Button 
                variant="ghost" 
                className={`text-white hover:bg-white/10 rounded-full p-2 ${focusedControl === 'forward10' && isTVMode ? 'ring-2 ring-white' : ''}`}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(
                      videoRef.current.duration || 0, 
                      videoRef.current.currentTime + 10
                    );
                  }
                }}
                data-control="forward10"
              >
                <SkipForward className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                className={`text-white hover:bg-white/10 rounded-full p-2 ${focusedControl === 'volume' && isTVMode ? 'ring-2 ring-white' : ''}`}
                onClick={() => setIsMuted(!isMuted)}
                data-control="volume"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </Button>
              
              <span className="text-sm">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 1:47:12
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 rounded-full p-2 hidden md:flex"
                onClick={() => {
                  toast({
                    title: "Adicionado",
                    description: "Conteúdo adicionado à sua lista",
                  });
                }}
              >
                <Plus className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 rounded-full p-2 hidden md:flex"
              >
                <ThumbsUp className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 rounded-full p-2 hidden md:flex"
              >
                <Share2 className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 rounded-full p-2 hidden sm:flex"
              >
                <Subtitles className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                className={`text-white hover:bg-white/10 rounded-full p-2 ${focusedControl === 'settings' && isTVMode ? 'ring-2 ring-white' : ''}`}
                data-control="settings"
              >
                <Settings className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                className={`text-white hover:bg-white/10 rounded-full p-2 ${focusedControl === 'fullscreen' && isTVMode ? 'ring-2 ring-white' : ''}`}
                onClick={toggleFullscreen}
                data-control="fullscreen"
              >
                <Maximize className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* TV mode indicator - just for debugging */}
      {isTVMode && (
        <div className="absolute top-20 right-4 bg-red-600/80 px-3 py-1 rounded-full text-sm font-medium">
          TV Mode
        </div>
      )}
    </div>
  );
};

export default Watch;
