
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface EpisodeVideoInputsProps {
  videoUrl480p: string;
  videoUrl720p: string;
  videoUrl1080p: string;
  onVideoUrlChange: (field: string, value: string) => void;
  onPreviewVideo: (url: string) => void;
}

const EpisodeVideoInputs: React.FC<EpisodeVideoInputsProps> = ({
  videoUrl480p,
  videoUrl720p,
  videoUrl1080p,
  onVideoUrlChange,
  onPreviewVideo
}) => {
  return (
    <div className="space-y-3 mt-3">
      <div>
        <label className="text-xs text-gray-500">URL do Vídeo (480p)</label>
        <div className="flex gap-2 mt-1">
          <Input 
            placeholder="URL para qualidade 480p"
            value={videoUrl480p || ''}
            onChange={(e) => onVideoUrlChange('videoUrl480p', e.target.value)}
          />
          {videoUrl480p && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => onPreviewVideo(videoUrl480p)}
              className="flex-shrink-0"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <label className="text-xs text-gray-500">URL do Vídeo (720p)</label>
        <div className="flex gap-2 mt-1">
          <Input 
            placeholder="URL para qualidade 720p"
            value={videoUrl720p || ''}
            onChange={(e) => onVideoUrlChange('videoUrl720p', e.target.value)}
          />
          {videoUrl720p && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => onPreviewVideo(videoUrl720p)}
              className="flex-shrink-0"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <label className="text-xs text-gray-500">URL do Vídeo (1080p)</label>
        <div className="flex gap-2 mt-1">
          <Input 
            placeholder="URL para qualidade 1080p"
            value={videoUrl1080p || ''}
            onChange={(e) => onVideoUrlChange('videoUrl1080p', e.target.value)}
          />
          {videoUrl1080p && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => onPreviewVideo(videoUrl1080p)}
              className="flex-shrink-0"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodeVideoInputs;
