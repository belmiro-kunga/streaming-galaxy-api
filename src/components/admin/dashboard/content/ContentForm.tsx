import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Film, Tv, Trash2, Link as LinkIcon, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadAPI } from '@/services/uploadAPI';
import { supabase } from '@/lib/supabase';

const STREAMING_SERVICES = [
  'Netflix',
  'Prime Video',
  'Disney+',
  'Max',
  'Paramount+',
  'Apple TV',
  'Globoplay',
  'Outro'
];

const CONTENT_TYPES = [
  'Filme',
  'Série',
  'Documentário',
  'Animação',
  'Show',
  'Outro'
];

const AGE_RATINGS = [
  'L',
  '10',
  '12',
  '14',
  '16',
  '18'
];

const COUNTRIES = [
  'Brasil',
  'Estados Unidos',
  'Portugal',
  'Angola',
  'Reino Unido',
  'França',
  'Espanha',
  'Outro'
];

const GENRES = [
  'Ação',
  'Aventura',
  'Comédia',
  'Drama',
  'Ficção Científica',
  'Terror',
  'Suspense',
  'Romance',
  'Animação',
  'Documentário',
  'Fantasia'
];

const LANGUAGES = [
  'Português',
  'Inglês',
  'Espanhol',
  'Francês',
  'Alemão',
  'Japonês',
  'Coreano',
  'Italiano'
];

const VIDEO_SOURCE_TYPES = [
  'Wasabi',
  'Cloudflare',
  'Outros'
];

interface ContentFormProps {
  editMode?: boolean;
  contentData?: any;
  contentType?: string;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

interface Season {
  id: string;
  number: number;
  episodes: Episode[];
}

interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: number;
  videoUrl?: string;
  videoSource?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({ 
  editMode = false, 
  contentData, 
  contentType = 'Filme',
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: editMode && contentData ? {
      ...contentData
    } : {
      title: '',
      type: contentType,
      isFree: false,
      category: '',
      streamingService: '',
      ageRating: 'L',
      isKidsFriendly: false,
      sourceType: 'streaming',
      country: 'Angola',
      director: '',
      cast: [],
      genres: [],
      languages: [],
      tags: [],
      description: '',
      videoUrl: '',
      videoSource: 'Wasabi',
      trailerUrl: ''
    }
  });

  const [portraitImage, setPortraitImage] = useState<File | null>(null);
  const [landscapeImage, setLandscapeImage] = useState<File | null>(null);
  const [portraitImageUrl, setPortraitImageUrl] = useState(editMode && contentData?.portraitImageUrl || '');
  const [landscapeImageUrl, setLandscapeImageUrl] = useState(editMode && contentData?.landscapeImageUrl || '');
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [uploadingLandscape, setUploadingLandscape] = useState(false);
  const [seasons, setSeasons] = useState<Season[]>(editMode && contentData?.seasons || []);
  const [activeTab, setActiveTab] = useState<string>("info");
  const [newGenre, setNewGenre] = useState('');
  const [newCastMember, setNewCastMember] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newTag, setNewTag] = useState('');
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [uploadingTrailer, setUploadingTrailer] = useState(false);
  const [trailerPreviewUrl, setTrailerPreviewUrl] = useState('');

  const currentContentType = form.watch('type');
  const videoUrl = form.watch('videoUrl');
  const trailerUrl = form.watch('trailerUrl');

  const handleAddGenre = () => {
    if (newGenre && !form.getValues('genres')?.includes(newGenre)) {
      const currentGenres = form.getValues('genres') || [];
      form.setValue('genres', [...currentGenres, newGenre]);
      setNewGenre('');
    }
  };

  const handleAddCastMember = () => {
    if (newCastMember && !form.getValues('cast')?.includes(newCastMember)) {
      const currentCast = form.getValues('cast') || [];
      form.setValue('cast', [...currentCast, newCastMember]);
      setNewCastMember('');
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage && !form.getValues('languages')?.includes(newLanguage)) {
      const currentLanguages = form.getValues('languages') || [];
      form.setValue('languages', [...currentLanguages, newLanguage]);
      setNewLanguage('');
    }
  };

  const handleAddTag = () => {
    if (newTag && !form.getValues('tags')?.includes(newTag)) {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    const currentGenres = form.getValues('genres') || [];
    form.setValue('genres', currentGenres.filter(g => g !== genre));
  };

  const handleRemoveCastMember = (castMember: string) => {
    const currentCast = form.getValues('cast') || [];
    form.setValue('cast', currentCast.filter(c => c !== castMember));
  };

  const handleRemoveLanguage = (language: string) => {
    const currentLanguages = form.getValues('languages') || [];
    form.setValue('languages', currentLanguages.filter(l => l !== language));
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };

  const handlePortraitImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.includes('webp')) {
        toast({
          title: "Formato não suportado",
          description: "Por favor, selecione um arquivo no formato WebP.",
          variant: "destructive",
        });
        return;
      }
      setPortraitImage(file);
      setPortraitImageUrl(URL.createObjectURL(file));
    }
  };

  const handleLandscapeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.includes('webp')) {
        toast({
          title: "Formato não suportado",
          description: "Por favor, selecione um arquivo no formato WebP.",
          variant: "destructive",
        });
        return;
      }
      setLandscapeImage(file);
      setLandscapeImageUrl(URL.createObjectURL(file));
    }
  };

  const handleTrailerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is a video file (including m3u8)
      const validTypes = ['video/mp4', 'video/webm', 'application/vnd.apple.mpegurl', 'application/x-mpegurl'];
      const isM3u8 = file.name.endsWith('.m3u8');
      
      if (!validTypes.includes(file.type) && !isM3u8) {
        toast({
          title: "Formato não suportado",
          description: "Por favor, selecione um arquivo de vídeo válido (MP4, WebM, M3U8).",
          variant: "destructive",
        });
        return;
      }
      
      setTrailerFile(file);
      
      // Create a preview URL for the trailer
      if (file.type !== 'application/vnd.apple.mpegurl' && !isM3u8) {
        setTrailerPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const uploadTrailer = async () => {
    if (!trailerFile) return '';
    
    setUploadingTrailer(true);
    try {
      let bucketPath = 'trailers';
      if (currentContentType === 'Série') {
        bucketPath = 'series-trailers';
      }
      
      const { url, error } = await uploadAPI.uploadVideo(trailerFile, bucketPath);
      if (error) throw error;
      setUploadingTrailer(false);
      return url;
    } catch (error) {
      console.error('Error uploading trailer:', error);
      toast({
        title: "Erro ao fazer upload do trailer",
        description: "Ocorreu um erro ao fazer upload do trailer.",
        variant: "destructive",
      });
      setUploadingTrailer(false);
      return '';
    }
  };

  const handlePreviewVideo = (url: string) => {
    if (!url) {
      toast({
        title: "Não há URL para visualizar",
        description: "Por favor, insira uma URL válida para visualizar o vídeo.",
        variant: "destructive",
      });
      return;
    }
    
    window.open(url, '_blank');
  };

  const addSeason = () => {
    const newSeason: Season = {
      id: `season-${Date.now()}`,
      number: seasons.length + 1,
      episodes: []
    };
    
    setSeasons([...seasons, newSeason]);
  };

  const removeSeason = (seasonId: string) => {
    setSeasons(seasons.filter(season => season.id !== seasonId));
  };

  const addEpisode = (seasonId: string) => {
    const updatedSeasons = seasons.map(season => {
      if (season.id === seasonId) {
        const newEpisode: Episode = {
          id: `episode-${Date.now()}`,
          number: season.episodes.length + 1,
          title: '',
          description: '',
          duration: 0
        };
        return {
          ...season,
          episodes: [...season.episodes, newEpisode]
        };
      }
      return season;
    });
    
    setSeasons(updatedSeasons);
  };

  const removeEpisode = (seasonId: string, episodeId: string) => {
    const updatedSeasons = seasons.map(season => {
      if (season.id === seasonId) {
        return {
          ...season,
          episodes: season.episodes.filter(episode => episode.id !== episodeId)
        };
      }
      return season;
    });
    
    setSeasons(updatedSeasons);
  };

  const updateEpisode = (seasonId: string, episodeId: string, field: string, value: any) => {
    const updatedSeasons = seasons.map(season => {
      if (season.id === seasonId) {
        const updatedEpisodes = season.episodes.map(episode => {
          if (episode.id === episodeId) {
            return {
              ...episode,
              [field]: value
            };
          }
          return episode;
        });
        
        return {
          ...season,
          episodes: updatedEpisodes
        };
      }
      return season;
    });
    
    setSeasons(updatedSeasons);
  };

  const uploadPortraitImage = async () => {
    if (!portraitImage) return '';
    
    setUploadingPortrait(true);
    try {
      const { url, error } = await uploadAPI.uploadImage(portraitImage, 'content-images/portraits');
      if (error) throw error;
      setUploadingPortrait(false);
      return url;
    } catch (error) {
      console.error('Error uploading portrait image:', error);
      toast({
        title: "Erro ao fazer upload da imagem",
        description: "Ocorreu um erro ao fazer upload da imagem de retrato.",
        variant: "destructive",
      });
      setUploadingPortrait(false);
      return '';
    }
  };

  const uploadLandscapeImage = async () => {
    if (!landscapeImage) return '';
    
    setUploadingLandscape(true);
    try {
      const { url, error } = await uploadAPI.uploadImage(landscapeImage, 'content-images/landscapes');
      if (error) throw error;
      setUploadingLandscape(false);
      return url;
    } catch (error) {
      console.error('Error uploading landscape image:', error);
      toast({
        title: "Erro ao fazer upload da imagem",
        description: "Ocorreu um erro ao fazer upload da imagem de paisagem.",
        variant: "destructive",
      });
      setUploadingLandscape(false);
      return '';
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!data.title || !data.type || !data.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!editMode && (!portraitImage || !landscapeImage)) {
      toast({
        title: "Imagens obrigatórias",
        description: "Por favor, selecione as imagens de retrato e paisagem.",
        variant: "destructive",
      });
      return;
    }

    if (data.type === 'Série' && seasons.length === 0) {
      toast({
        title: "Temporadas necessárias",
        description: "Por favor, adicione pelo menos uma temporada para a série.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload images
      let finalPortraitUrl = portraitImageUrl;
      let finalLandscapeUrl = landscapeImageUrl;
      let finalTrailerUrl = data.trailerUrl;
      
      if (portraitImage) {
        finalPortraitUrl = await uploadPortraitImage();
      }
      
      if (landscapeImage) {
        finalLandscapeUrl = await uploadLandscapeImage();
      }
      
      if (trailerFile) {
        finalTrailerUrl = await uploadTrailer();
      }

      // Prepare final object with all data
      const contentToSave = {
        ...data,
        portraitImageUrl: finalPortraitUrl,
        landscapeImageUrl: finalLandscapeUrl,
        trailerUrl: finalTrailerUrl,
        seasons: data.type === 'Série' ? seasons : [],
      };

      // Send to callback or API
      if (onSubmit) {
        onSubmit(contentToSave);
      } else {
        // Default implementation if no callback
        const { data: savedContent, error } = await supabase
          .from('conteudos')
          .upsert({
            id: editMode && contentData?.id ? contentData.id : undefined,
            titulo: contentToSave.title,
            tipo: contentToSave.type.toLowerCase(),
            descricao: contentToSave.description,
            classificacao_etaria: contentToSave.ageRating,
            gratuito: contentToSave.isFree,
            metadata: {
              portraitImageUrl: finalPortraitUrl,
              landscapeImageUrl: finalLandscapeUrl,
              isKidsFriendly: contentToSave.isKidsFriendly,
              sourceType: contentToSave.sourceType,
              streamingService: contentToSave.streamingService,
              country: contentToSave.country,
              director: contentToSave.director,
              cast: contentToSave.cast,
              genres: contentToSave.genres,
              languages: contentToSave.languages,
              tags: contentToSave.tags,
              seasons: contentToSave.seasons,
              videoUrl: contentToSave.videoUrl,
              videoSource: contentToSave.videoSource,
              trailerUrl: contentToSave.trailerUrl
            }
          })
          .select();

        if (error) throw error;

        toast({
          title: `Conteúdo ${editMode ? 'atualizado' : 'adicionado'}`,
          description: `O conteúdo foi ${editMode ? 'atualizado' : 'adicionado'} com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Erro ao salvar conteúdo",
        description: "Ocorreu um erro ao salvar o conteúdo. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="info">Informações Gerais</TabsTrigger>
            <TabsTrigger value="media">Mídia</TabsTrigger>
            <TabsTrigger value="video">Vídeo</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            {currentContentType === 'Série' && (
              <TabsTrigger value="seasons">Temporadas</TabsTrigger>
            )}
          </TabsList>

          {/* Tab: Informações Gerais */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do conteúdo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Conteúdo *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONTENT_TYPES.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="streamingService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serviço de Streaming *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o serviço" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STREAMING_SERVICES.map(service => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sourceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origem</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a origem" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="streaming">Streaming</SelectItem>
                            <SelectItem value="cinema">Cinema</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ageRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classificação Etária</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a classificação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AGE_RATINGS.map(rating => (
                              <SelectItem key={rating} value={rating}>
                                {rating === 'L' ? 'Livre' : rating + ' anos'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País de Origem</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o país" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COUNTRIES.map(country => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Conteúdo Gratuito</FormLabel>
                          <FormDescription>
                            Marque se o conteúdo estará disponível gratuitamente
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isKidsFriendly"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Modo Kids</FormLabel>
                          <FormDescription>
                            Marque se o conteúdo é apropriado para crianças
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o conteúdo"
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Mídia */}
          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Imagens do Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormLabel>Imagem de Retrato (Formato WebP) *</FormLabel>
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg h-64 overflow-hidden relative">
                      {portraitImageUrl ? (
                        <>
                          <img 
                            src={portraitImageUrl} 
                            alt="Retrato" 
                            className="object-cover h-full w-full" 
                          />
                          <Button 
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setPortraitImage(null);
                              setPortraitImageUrl('');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                          <p className="text-gray-500 text-sm">
                            Clique para fazer upload da imagem de retrato (formato WebP)
                          </p>
                          <input
                            type="file"
                            accept="image/webp"
                            onChange={handlePortraitImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Recomendado: Imagem de retrato (vertical) no formato WebP
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel>Imagem de Paisagem (Formato WebP) *</FormLabel>
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg h-64 overflow-hidden relative">
                      {landscapeImageUrl ? (
                        <>
                          <img 
                            src={landscapeImageUrl} 
                            alt="Paisagem" 
                            className="object-cover h-full w-full" 
                          />
                          <Button 
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setLandscapeImage(null);
                              setLandscapeImageUrl('');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                          <p className="text-gray-500 text-sm">
                            Clique para fazer upload da imagem de paisagem (formato WebP)
                          </p>
                          <input
                            type="file"
                            accept="image/webp"
                            onChange={handleLandscapeImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Recomendado: Imagem de paisagem (horizontal) no formato WebP
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova Tab: Vídeo */}
          <TabsContent value="video" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vídeos do Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Fonte do Vídeo */}
                  <FormField
                    control={form.control}
                    name="videoSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fonte do Vídeo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a fonte do vídeo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VIDEO_SOURCE_TYPES.map(source => (
                              <SelectItem key={source} value={source}>
                                {source}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Selecione de onde o vídeo está sendo hospedado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* URL do Vídeo Principal */}
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do Vídeo</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input 
                              placeholder="Exemplo: https://storage.wasabisys.com/video.mp4 ou https://watch.cloudflare.com/video.m3u8" 
                              {...field} 
                            />
                          </FormControl>
                          {videoUrl && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => handlePreviewVideo(videoUrl)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" /> Visualizar
                            </Button>
                          )}
                        </div>
                        <FormDescription>
                          Insira a URL completa do vídeo. Suporta links diretos e streams HLS (m3u8)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* URL do Trailer */}
                  <FormField
                    control={form.control}
                    name="trailerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do Trailer</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input 
                              placeholder="URL do trailer" 
                              {...field} 
                            />
                          </FormControl>
                          {trailerUrl && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => handlePreviewVideo(trailerUrl)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" /> Visualizar
                            </Button>
                          )}
                        </div>
                        <FormDescription>
                          Insira a URL do trailer ou faça upload abaixo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Upload de Trailer */}
                  <div className="space-y-2">
                    <FormLabel>Upload de Trailer</FormLabel>
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg h-40 overflow-hidden relative">
                      {trailerPreviewUrl ? (
                        <div className="w-full h-full relative">
                          <video 
                            src={trailerPreviewUrl} 
                            controls
                            className="w-full h-full object-contain" 
                          />
                          <Button 
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setTrailerFile(null);
                              setTrailerPreviewUrl('');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                          <p className="text-gray-500 text-sm">
                            Clique para fazer upload do trailer (suporta MP4, WebM e M3U8)
                          </p>
                          <input
                            type="file"
                            accept="video/mp4,video/webm,application/vnd.apple.mpegurl,.m3u8"
                            onChange={handleTrailerChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
