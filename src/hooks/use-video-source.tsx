
import { useState, useEffect } from 'react';

export interface VideoSource {
  provider: 'wasabi' | 'cloudflare' | 'youtube' | 'direct' | 'other';
  url: string;
  qualityUrls?: {
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
  subtitles?: Array<{
    src: string;
    label: string;
    language: string;
  }>;
  isValid: boolean;
}

export const useVideoSource = (sourceUrl?: string, contentId?: string) => {
  const [videoSource, setVideoSource] = useState<VideoSource>({
    provider: 'direct',
    url: '',
    isValid: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sourceUrl) {
      setIsLoading(false);
      setError('URL de vídeo não fornecida');
      return;
    }

    setIsLoading(true);
    setError(null);

    const detectProvider = (url: string): VideoSource['provider'] => {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'youtube';
      } else if (url.includes('wasabisys.com') || url.includes('wasabi.com')) {
        return 'wasabi';
      } else if (url.includes('cloudflare.com') || url.includes('cloudflare.net') || url.includes('r2.dev')) {
        return 'cloudflare';
      } else {
        return 'direct';
      }
    };

    // Simulate fetching quality options
    const fetchQualityOptions = async (url: string, provider: VideoSource['provider']) => {
      // This would typically be an API call to get different quality URLs
      // For now, we'll simulate it
      if (provider === 'direct') {
        return {};
      }

      try {
        // In a real app, you would fetch this from your API
        if (contentId) {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Mock response for demonstration
          const baseUrl = url.split('?')[0];
          return {
            '480p': baseUrl.replace('.mp4', '_480p.mp4'),
            '720p': baseUrl.replace('.mp4', '_720p.mp4'),
            '1080p': baseUrl.replace('.mp4', '_1080p.mp4')
          };
        }
        return {};
      } catch (err) {
        console.error('Error fetching quality options:', err);
        return {};
      }
    };

    // Simulate fetching subtitles
    const fetchSubtitles = async (contentId?: string) => {
      if (!contentId) return [];
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock response for demonstration
        return [
          {
            src: `https://example.com/subtitles/${contentId}_pt.vtt`,
            label: 'Português',
            language: 'pt'
          },
          {
            src: `https://example.com/subtitles/${contentId}_en.vtt`,
            label: 'Inglês',
            language: 'en'
          }
        ];
      } catch (err) {
        console.error('Error fetching subtitles:', err);
        return [];
      }
    };

    const initializeSource = async () => {
      try {
        const provider = detectProvider(sourceUrl);
        const qualityUrls = await fetchQualityOptions(sourceUrl, provider);
        const subtitles = await fetchSubtitles(contentId);
        
        setVideoSource({
          provider,
          url: sourceUrl,
          qualityUrls,
          subtitles,
          isValid: true
        });
      } catch (err) {
        setError('Erro ao processar fonte de vídeo');
        console.error('Error processing video source:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSource();
  }, [sourceUrl, contentId]);

  // Convert to format expected by video player
  const getPlayerOptions = () => {
    const qualityOptions = videoSource.qualityUrls
      ? Object.entries(videoSource.qualityUrls).map(([quality, url]) => ({
          label: quality,
          src: url || ''
        }))
      : [];

    return {
      url: videoSource.url,
      qualityOptions,
      subtitles: videoSource.subtitles || []
    };
  };

  return {
    videoSource,
    isLoading,
    error,
    getPlayerOptions
  };
};
