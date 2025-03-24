
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { VideoSourceManager } from './VideoSourceManager';
import { 
  File, 
  Film, 
  Upload, 
  Info, 
  Image, 
  Video, 
  Save, 
  X, 
  Globe,
  Tag,
  Calendar,
  Clock,
  Users,
  MapPin
} from 'lucide-react';
import { ContentItem } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

interface EnhancedContentFormProps {
  initialData?: Partial<ContentItem>;
  onSubmit: (data: Partial<ContentItem>) => void;
  onCancel: () => void;
  contentType?: 'Filme' | 'Série' | 'Documentário';
}

export function EnhancedContentForm({
  initialData = {},
  onSubmit,
  onCancel,
  contentType = 'Filme'
}: EnhancedContentFormProps) {
  const [formData, setFormData] = useState<Partial<ContentItem>>({
    tipo: contentType.toLowerCase(),
    gratuito: false,
    ...initialData
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value ? parseInt(value, 10) : undefined
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle metadata changes
  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [name]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Basic validation
      if (!formData.titulo) {
        toast({
          title: "Campo obrigatório",
          description: "O título é obrigatório",
          variant: "destructive"
        });
        setActiveTab('basic');
        setIsSubmitting(false);
        return;
      }
      
      // Submit data
      await onSubmit(formData);
      
      toast({
        title: "Conteúdo salvo",
        description: `${contentType} salvo com sucesso.`
      });
    } catch (error) {
      console.error('Error submitting content:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o conteúdo",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white">
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="text-2xl">{initialData.id ? `Editar ${contentType}` : `Novo ${contentType}`}</CardTitle>
          <CardDescription>
            {initialData.id 
              ? 'Atualize as informações do conteúdo existente'
              : 'Adicione um novo conteúdo à plataforma'}
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Info className="h-4 w-4" /> Informações Básicas
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <Video className="h-4 w-4" /> Mídia
              </TabsTrigger>
              <TabsTrigger value="metadata" className="flex items-center gap-2">
                <File className="h-4 w-4" /> Metadados
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Image className="h-4 w-4" /> Imagens
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título <span className="text-red-500">*</span></Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    placeholder="Título do conteúdo"
                    value={formData.titulo || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metadata.titulo_original">Título Original</Label>
                  <Input
                    id="metadata.titulo_original"
                    name="titulo_original"
                    placeholder="Título original (se for estrangeiro)"
                    value={formData.metadata?.titulo_original || ''}
                    onChange={handleMetadataChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ano_lancamento">Ano de Lançamento</Label>
                  <Input
                    id="ano_lancamento"
                    name="ano_lancamento"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="Ano"
                    value={formData.ano_lancamento || ''}
                    onChange={handleNumberChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="classificacao_etaria">Classificação Etária</Label>
                  <Select
                    value={formData.classificacao_etaria || ''}
                    onValueChange={(value) => handleSelectChange('classificacao_etaria', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma classificação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Livre</SelectItem>
                      <SelectItem value="10">10 anos</SelectItem>
                      <SelectItem value="12">12 anos</SelectItem>
                      <SelectItem value="14">14 anos</SelectItem>
                      <SelectItem value="16">16 anos</SelectItem>
                      <SelectItem value="18">18 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Descreva o conteúdo..."
                    className="min-h-32"
                    value={formData.descricao || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duracao">{contentType === 'Série' ? 'Total de Episódios' : 'Duração'}</Label>
                  <Input
                    id="duracao"
                    name="duracao"
                    placeholder={contentType === 'Série' ? 'Ex: 10 episódios' : 'Ex: 2h 30min'}
                    value={formData.duracao || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2 h-full pt-6">
                  <Switch
                    id="gratuito"
                    checked={formData.gratuito || false}
                    onCheckedChange={(checked) => handleSwitchChange('gratuito', checked)}
                  />
                  <Label htmlFor="gratuito">Conteúdo Gratuito</Label>
                </div>
              </div>
            </TabsContent>
            
            {/* Media Tab */}
            <TabsContent value="media">
              <VideoSourceManager 
                contentType={contentType.toLowerCase() === 'filme' ? 'movie' : 'series'}
                onChange={(sources) => {
                  const videoUrls = {
                    video_url: '',
                    video_url_480p: '',
                    video_url_720p: '',
                    video_url_1080p: ''
                  };
                  
                  sources.forEach(source => {
                    if (!source.isActive) return;
                    
                    if (source.quality === 'original') {
                      videoUrls.video_url = source.url;
                    } else if (source.quality === '480p') {
                      videoUrls.video_url_480p = source.url;
                    } else if (source.quality === '720p') {
                      videoUrls.video_url_720p = source.url;
                    } else if (source.quality === '1080p') {
                      videoUrls.video_url_1080p = source.url;
                    }
                  });
                  
                  setFormData(prev => ({
                    ...prev,
                    ...videoUrls
                  }));
                }}
              />
              
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trailer_url">URL do Trailer</Label>
                  <Input
                    id="trailer_url"
                    name="trailer_url"
                    placeholder="https://youtube.com/watch?v=xxxx"
                    value={formData.trailer_url || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Metadata Tab */}
            <TabsContent value="metadata" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metadata.diretor" className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> Diretor(es)
                  </Label>
                  <Input
                    id="metadata.diretor"
                    name="diretor"
                    placeholder="Nome do(s) diretor(es)"
                    value={formData.metadata?.diretor || ''}
                    onChange={handleMetadataChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metadata.elenco" className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> Elenco Principal
                  </Label>
                  <Input
                    id="metadata.elenco"
                    name="elenco"
                    placeholder="Atores principais separados por vírgula"
                    value={formData.metadata?.elenco || ''}
                    onChange={handleMetadataChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metadata.origem" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> País de Origem
                  </Label>
                  <Input
                    id="metadata.origem"
                    name="origem"
                    placeholder="Ex: EUA, Brasil, etc."
                    value={formData.metadata?.origem || ''}
                    onChange={handleMetadataChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metadata.diretorio" className="flex items-center gap-1">
                    <Globe className="h-4 w-4" /> Plataforma Original
                  </Label>
                  <Select
                    value={formData.metadata?.diretorio || ''}
                    onValueChange={(value) => {
                      setFormData(prev => ({
                        ...prev,
                        metadata: {
                          ...prev.metadata,
                          diretorio: value
                        }
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Netflix">Netflix</SelectItem>
                      <SelectItem value="Prime Video">Prime Video</SelectItem>
                      <SelectItem value="Disney+">Disney+</SelectItem>
                      <SelectItem value="HBO Max">HBO Max</SelectItem>
                      <SelectItem value="Apple TV+">Apple TV+</SelectItem>
                      <SelectItem value="Hulu">Hulu</SelectItem>
                      <SelectItem value="Paramount+">Paramount+</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {contentType === 'Série' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="metadata.temporada" className="flex items-center gap-1">
                        <Tag className="h-4 w-4" /> Temporada
                      </Label>
                      <Input
                        id="metadata.temporada"
                        name="temporada"
                        type="number"
                        min="1"
                        placeholder="Número da temporada"
                        value={formData.metadata?.temporada || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            metadata: {
                              ...prev.metadata,
                              temporada: e.target.value ? parseInt(e.target.value, 10) : undefined
                            }
                          }));
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metadata.total_temporadas" className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Total de Temporadas
                      </Label>
                      <Input
                        id="metadata.total_temporadas"
                        name="total_temporadas"
                        type="number"
                        min="1"
                        placeholder="Total de temporadas"
                        value={formData.metadata?.total_temporadas || ''}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            metadata: {
                              ...prev.metadata,
                              total_temporadas: e.target.value ? parseInt(e.target.value, 10) : undefined
                            }
                          }));
                        }}
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="generos" className="flex items-center gap-1">
                    <Tag className="h-4 w-4" /> Gêneros
                  </Label>
                  <Input
                    id="generos"
                    name="generos"
                    placeholder="Gêneros separados por vírgula (Ação, Drama, etc.)"
                    value={formData.generos?.join(', ') || ''}
                    onChange={(e) => {
                      const genres = e.target.value
                        .split(',')
                        .map(g => g.trim())
                        .filter(g => g.length > 0);
                      
                      setFormData(prev => ({
                        ...prev,
                        generos: genres
                      }));
                    }}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="poster_url" className="block mb-1">Poster (Vertical)</Label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-2/3">
                    <Input
                      id="poster_url"
                      name="poster_url"
                      placeholder="URL da imagem de poster"
                      value={formData.poster_url || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full md:w-1/3 aspect-[2/3] bg-gray-800 rounded-md overflow-hidden">
                    {formData.poster_url ? (
                      <img
                        src={formData.poster_url}
                        alt="Poster Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Poster+Preview';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Image className="h-10 w-10 mx-auto mb-2 text-gray-600" />
                          <p>Preview do Poster</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backdrop_url" className="block mb-1">Backdrop (Horizontal)</Label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-2/3">
                    <Input
                      id="backdrop_url"
                      name="backdrop_url"
                      placeholder="URL da imagem de backdrop (fundo)"
                      value={formData.backdrop_url || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full md:w-1/3 aspect-video bg-gray-800 rounded-md overflow-hidden">
                    {formData.backdrop_url ? (
                      <img
                        src={formData.backdrop_url}
                        alt="Backdrop Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x1080?text=Backdrop+Preview';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Image className="h-10 w-10 mx-auto mb-2 text-gray-600" />
                          <p>Preview do Backdrop</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 border border-dashed border-gray-700 rounded-md bg-gray-800/50">
                <div className="flex items-start">
                  <Upload className="h-6 w-6 text-gray-400 mr-3 mt-1" />
                  <div>
                    <h4 className="text-md font-medium text-white">Upload de Imagens</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Para fazer upload direto de imagens, use a opção de gerenciamento de mídia.
                    </p>
                    <Button variant="outline" size="sm">
                      Gerenciar Mídia
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar {contentType}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
