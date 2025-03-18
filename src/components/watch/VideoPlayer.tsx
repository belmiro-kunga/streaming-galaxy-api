
import React, { useState } from 'react';
import { Eye, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, Languages, Subtitles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Tooltip } from '@/components/ui/tooltip';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isBuffering: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (value: number[]) => void;
  onToggleFullscreen: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  title,
  isPlaying,
  isMuted,
  currentTime,
  duration,
  volume,
  isBuffering,
  onTogglePlay,
  onToggleMute,
  onSeek,
  onVolumeChange,
  onToggleFullscreen
}) => {
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [progressHoverTime, setProgressHoverTime] = useState<number | null>(null);
  const [progressHoverPosition, setProgressHoverPosition] = useState<number | null>(null);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [subtitlesLanguage, setSubtitlesLanguage] = useState<'Português' | 'English' | 'Español'>('Português');
  const [audioLanguage, setAudioLanguage] = useState<'Original' | 'Português' | 'English'>('Original');
  const [videoQuality, setVideoQuality] = useState<'1080p' | '720p' | '480p' | 'Auto'>('Auto');

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const timePosition = position * duration;
    
    setProgressHoverPosition(e.clientX - rect.left);
    setProgressHoverTime(timePosition);
  };

  const handleProgressLeave = () => {
    setProgressHoverTime(null);
    setProgressHoverPosition(null);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * duration;
    
    onSeek(newTime);
  };

  return (
    <div className="relative aspect-video w-full bg-black">
      <iframe
        id="youtube-player"
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playsinline=1&origin=${window.location.origin}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* Player Controls */}
      <AnimatePresence>
        {(showControls || isHovering) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col justify-between z-10 p-4"
            onClick={onTogglePlay}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
              <div 
                className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer group"
                onClick={(e) => e.stopPropagation()}
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

            {/* Time and Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePlay();
                  }}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMute();
                    }}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>

                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-4 bg-black/90 rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                      >
                        <div className="h-24">
                          <Slider
                            value={[volume]}
                            max={100}
                            step={1}
                            orientation="vertical"
                            onValueChange={onVolumeChange}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFullscreen();
                  }}
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
