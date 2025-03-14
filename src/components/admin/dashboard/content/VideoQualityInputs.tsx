
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface VideoQualityInputsProps {
  form: UseFormReturn<any>;
  onPreviewVideo: (url: string) => void;
}

const VideoQualityInputs: React.FC<VideoQualityInputsProps> = ({ form, onPreviewVideo }) => {
  const videoUrl480p = form.watch('videoUrl480p');
  const videoUrl720p = form.watch('videoUrl720p');
  const videoUrl1080p = form.watch('videoUrl1080p');
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="videoUrl480p"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL do Vídeo (480p)</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input 
                  placeholder="URL para qualidade 480p (ex: https://storage.wasabisys.com/video-480p.mp4)" 
                  {...field} 
                />
              </FormControl>
              {videoUrl480p && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onPreviewVideo(videoUrl480p)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" /> Visualizar
                </Button>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="videoUrl720p"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL do Vídeo (720p)</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input 
                  placeholder="URL para qualidade 720p (ex: https://storage.wasabisys.com/video-720p.mp4)" 
                  {...field} 
                />
              </FormControl>
              {videoUrl720p && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onPreviewVideo(videoUrl720p)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" /> Visualizar
                </Button>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="videoUrl1080p"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL do Vídeo (1080p)</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input 
                  placeholder="URL para qualidade 1080p (ex: https://storage.wasabisys.com/video-1080p.mp4)" 
                  {...field} 
                />
              </FormControl>
              {videoUrl1080p && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onPreviewVideo(videoUrl1080p)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" /> Visualizar
                </Button>
              )}
            </div>
            <FormDescription>
              Insira URLs completas dos vídeos. Suporta links diretos e streams HLS (m3u8)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VideoQualityInputs;
