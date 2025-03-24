
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  CloudflareIcon, 
  WasabiIcon, 
  YoutubeIcon, 
  DirectLinkIcon 
} from './storage-icons';
import { Film, Trash2, Plus, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoSource {
  type: 'direct' | 'wasabi' | 'cloudflare' | 'youtube';
  quality: '480p' | '720p' | '1080p' | 'original';
  url: string;
  isActive: boolean;
}

interface VideoSourceManagerProps {
  initialSources?: VideoSource[];
  onChange?: (sources: VideoSource[]) => void;
  contentType?: 'movie' | 'series';
}

export function VideoSourceManager({
  initialSources = [],
  onChange,
  contentType = 'movie'
}: VideoSourceManagerProps) {
  const [activeTab, setActiveTab] = useState<string>('direct');
  const [videoSources, setVideoSources] = useState<VideoSource[]>(initialSources);
  const [newSource, setNewSource] = useState<VideoSource>({
    type: 'direct',
    quality: 'original',
    url: '',
    isActive: true
  });
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSource({
      ...newSource,
      url: e.target.value
    });
  };

  // Handle quality change
  const handleQualityChange = (quality: VideoSource['quality']) => {
    setNewSource({
      ...newSource,
      quality
    });
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setNewSource({
      ...newSource,
      type: value as VideoSource['type']
    });
  };

  // Add new source
  const handleAddSource = () => {
    if (!newSource.url.trim()) {
      toast({
        title: "URL necessária",
        description: "Por favor, insira uma URL válida para o vídeo.",
        variant: "destructive"
      });
      return;
    }

    const updatedSources = [...videoSources, { ...newSource, isActive: true }];
    setVideoSources(updatedSources);
    
    // Reset form
    setNewSource({
      ...newSource,
      url: ''
    });
    
    // Notify parent
    if (onChange) {
      onChange(updatedSources);
    }
    
    toast({
      title: "Fonte adicionada",
      description: `Fonte de vídeo ${newSource.quality} adicionada com sucesso.`
    });
  };

  // Remove source
  const handleRemoveSource = (index: number) => {
    const updatedSources = videoSources.filter((_, i) => i !== index);
    setVideoSources(updatedSources);
    
    // Notify parent
    if (onChange) {
      onChange(updatedSources);
    }
    
    toast({
      title: "Fonte removida",
      description: "A fonte de vídeo foi removida."
    });
  };

  // Toggle source active state
  const handleToggleSource = (index: number) => {
    const updatedSources = [...videoSources];
    updatedSources[index].isActive = !updatedSources[index].isActive;
    setVideoSources(updatedSources);
    
    // Notify parent
    if (onChange) {
      onChange(updatedSources);
    }
    
    toast({
      title: updatedSources[index].isActive ? "Fonte ativada" : "Fonte desativada",
      description: `A fonte de vídeo foi ${updatedSources[index].isActive ? 'ativada' : 'desativada'}.`
    });
  };

  // Validate URL
  const validateUrl = () => {
    if (!newSource.url.trim()) {
      toast({
        title: "URL necessária",
        description: "Por favor, insira uma URL para validar.",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    
    // Simulate validation - in a real app, you would check if the URL is valid
    setTimeout(() => {
      setIsValidating(false);
      toast({
        title: "URL validada",
        description: "A URL parece ser válida e acessível.",
      });
    }, 1500);
  };

  // Get icon for source type
  const getSourceTypeIcon = (type: VideoSource['type']) => {
    switch (type) {
      case 'wasabi':
        return <WasabiIcon className="h-5 w-5" />;
      case 'cloudflare':
        return <CloudflareIcon className="h-5 w-5" />;
      case 'youtube':
        return <YoutubeIcon className="h-5 w-5" />;
      case 'direct':
      default:
        return <DirectLinkIcon className="h-5 w-5" />;
    }
  };

  // Get quality badge color
  const getQualityBadgeColor = (quality: VideoSource['quality']) => {
    switch (quality) {
      case '480p':
        return "bg-yellow-600";
      case '720p':
        return "bg-blue-600";
      case '1080p':
        return "bg-green-600";
      case 'original':
      default:
        return "bg-purple-600";
    }
  };

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="h-5 w-5" />
          Fontes de Vídeo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Added Sources List */}
        {videoSources.length > 0 ? (
          <div className="mb-6 space-y-3">
            <h3 className="text-sm font-medium text-gray-400">Fontes Adicionadas</h3>
            {videoSources.map((source, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-md border ${
                  source.isActive 
                    ? 'border-gray-700 bg-gray-800' 
                    : 'border-gray-800 bg-gray-900 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getSourceTypeIcon(source.type)}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getQualityBadgeColor(source.quality)}>
                        {source.quality}
                      </Badge>
                      {!source.isActive && (
                        <Badge variant="outline" className="border-gray-700 text-gray-400">
                          Inativo
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 truncate max-w-[300px]">
                      {source.url}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleToggleSource(index)}
                  >
                    {source.isActive ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Check className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveSource(index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 p-6 border border-dashed border-gray-700 rounded-md flex flex-col items-center justify-center text-center">
            <Film className="h-10 w-10 text-gray-700 mb-2" />
            <h3 className="text-gray-400">Nenhuma fonte de vídeo adicionada</h3>
            <p className="text-gray-500 text-sm">
              Adicione fontes de vídeo usando o formulário abaixo
            </p>
          </div>
        )}
        
        {/* Add New Source Form */}
        <div className="bg-gray-800 rounded-md p-4 border border-gray-700">
          <h3 className="text-sm font-medium text-white mb-4">Adicionar Nova Fonte</h3>
          
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="direct" className="flex items-center gap-2">
                <DirectLinkIcon className="h-4 w-4" /> Link Direto
              </TabsTrigger>
              <TabsTrigger value="wasabi" className="flex items-center gap-2">
                <WasabiIcon className="h-4 w-4" /> Wasabi
              </TabsTrigger>
              <TabsTrigger value="cloudflare" className="flex items-center gap-2">
                <CloudflareIcon className="h-4 w-4" /> Cloudflare
              </TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <YoutubeIcon className="h-4 w-4" /> YouTube
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="direct-url">URL do Arquivo</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="direct-url"
                      placeholder="https://exemplo.com/video.mp4"
                      value={newSource.url}
                      onChange={handleInputChange}
                      className="flex-grow"
                    />
                    <Button 
                      variant="outline" 
                      onClick={validateUrl}
                      disabled={isValidating}
                    >
                      {isValidating ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Validar
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="wasabi">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="wasabi-url">URL do Wasabi</Label>
                  <Input
                    id="wasabi-url"
                    placeholder="https://s3.wasabisys.com/bucket/video.mp4"
                    value={newSource.url}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cloudflare">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cloudflare-url">URL do Cloudflare R2</Label>
                  <Input
                    id="cloudflare-url"
                    placeholder="https://pub-xxxx.r2.dev/videos/video.mp4"
                    value={newSource.url}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="youtube">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="youtube-url">URL do YouTube</Label>
                  <Input
                    id="youtube-url"
                    placeholder="https://youtube.com/watch?v=xxxx"
                    value={newSource.url}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Quality Selector */}
          <div className="mt-4">
            <Label className="block mb-2">Qualidade</Label>
            <div className="flex flex-wrap gap-2">
              {(['480p', '720p', '1080p', 'original'] as const).map((quality) => (
                <Badge
                  key={quality}
                  className={`cursor-pointer ${
                    newSource.quality === quality
                      ? getQualityBadgeColor(quality)
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => handleQualityChange(quality)}
                >
                  {quality}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Add Button */}
          <div className="mt-6">
            <Button 
              className="w-full" 
              onClick={handleAddSource}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Fonte de Vídeo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
