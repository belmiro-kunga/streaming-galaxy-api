
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
import { X, Plus, Upload, Film, Tv, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadAPI } from '@/services/uploadAPI';
import { supabase } from '@/lib/supabase';

// Conteúdo categorias e subcategorias
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

interface ContentFormProps {
  editMode?: boolean;
  contentData?: any;
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
}

const ContentForm: React.FC<ContentFormProps> = ({ 
  editMode = false, 
  contentData, 
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: editMode && contentData ? {
      ...contentData
    } : {
      title: '',
      type: 'Filme',
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
      description: ''
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

  const contentType = form.watch('type');

  // Manipuladores para tags, elenco, gêneros, etc.
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

  // Manipulador de imagens
  const handlePortraitImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Verificar se é um arquivo webp
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
      // Verificar se é um arquivo webp
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

  // Manipuladores para temporadas e episódios
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

  // Upload de imagens
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
    // Validar os campos obrigatórios
    if (!data.title || !data.type || !data.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se há imagens selecionadas (obrigatório para novo conteúdo)
    if (!editMode && (!portraitImage || !landscapeImage)) {
      toast({
        title: "Imagens obrigatórias",
        description: "Por favor, selecione as imagens de retrato e paisagem.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se é série e se tem pelo menos uma temporada
    if (data.type === 'Série' && seasons.length === 0) {
      toast({
        title: "Temporadas necessárias",
        description: "Por favor, adicione pelo menos uma temporada para a série.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload de imagens
      let finalPortraitUrl = portraitImageUrl;
      let finalLandscapeUrl = landscapeImageUrl;
      
      if (portraitImage) {
        finalPortraitUrl = await uploadPortraitImage();
      }
      
      if (landscapeImage) {
        finalLandscapeUrl = await uploadLandscapeImage();
      }

      // Preparar objeto final com todos os dados
      const contentToSave = {
        ...data,
        portraitImageUrl: finalPortraitUrl,
        landscapeImageUrl: finalLandscapeUrl,
        seasons: data.type === 'Série' ? seasons : [],
      };

      // Enviar para callback ou API
      if (onSubmit) {
        onSubmit(contentToSave);
      } else {
        // Implementação padrão caso não haja callback
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
              seasons: contentToSave.seasons
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
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            {contentType === 'Série' && (
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
                {/* Título */}
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

                {/* Tipo de Conteúdo */}
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
                  {/* Categoria (Streaming Service) */}
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

                  {/* Origem (Cinema ou Streaming) */}
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
                  {/* Classificação Etária */}
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

                  {/* País de Origem */}
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
                  {/* Conteúdo Gratuito */}
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

                  {/* Modo Kids */}
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

                {/* Descrição */}
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
                  {/* Imagem de Retrato */}
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
                  
                  {/* Imagem de Paisagem */}
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

          {/* Tab: Detalhes */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Diretor */}
                <FormField
                  control={form.control}
                  name="director"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diretor</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do diretor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gêneros */}
                <FormField
                  control={form.control}
                  name="genres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gêneros</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value?.map((genre: string) => (
                          <Badge 
                            key={genre} 
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {genre}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveGenre(genre)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex">
                        <Select
                          onValueChange={(value) => {
                            setNewGenre(value);
                            setTimeout(() => handleAddGenre(), 10);
                          }}
                          value={newGenre}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione ou digite gêneros" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GENRES.map(genre => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          onClick={handleAddGenre} 
                          variant="outline" 
                          className="ml-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Elenco */}
                <FormField
                  control={form.control}
                  name="cast"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Elenco</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value?.map((castMember: string) => (
                          <Badge 
                            key={castMember} 
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {castMember}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveCastMember(castMember)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex">
                        <Input 
                          placeholder="Adicionar pessoa do elenco" 
                          value={newCastMember}
                          onChange={(e) => setNewCastMember(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCastMember();
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddCastMember} 
                          variant="outline" 
                          className="ml-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Idiomas */}
                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idiomas (Dublado/Legendado)</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value?.map((language: string) => (
                          <Badge 
                            key={language} 
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {language}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveLanguage(language)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex">
                        <Select
                          onValueChange={(value) => {
                            setNewLanguage(value);
                            setTimeout(() => handleAddLanguage(), 10);
                          }}
                          value={newLanguage}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um idioma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LANGUAGES.map(language => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                            <SelectItem value="Português (Dublado)">Português (Dublado)</SelectItem>
                            <SelectItem value="Português (Legendado)">Português (Legendado)</SelectItem>
                            <SelectItem value="Inglês (Legendado)">Inglês (Legendado)</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          onClick={handleAddLanguage} 
                          variant="outline" 
                          className="ml-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value?.map((tag: string) => (
                          <Badge 
                            key={tag} 
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex">
                        <Input 
                          placeholder="Adicionar tag (pressione Enter)" 
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddTag} 
                          variant="outline" 
                          className="ml-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>
                        Digite e pressione Enter para adicionar várias tags
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Temporadas e Episódios (apenas para séries) */}
          {contentType === 'Série' && (
            <TabsContent value="seasons" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Temporadas e Episódios</CardTitle>
                  <Button 
                    type="button" 
                    onClick={addSeason}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Adicionar Temporada
                  </Button>
                </CardHeader>
                <CardContent>
                  {seasons.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Tv className="h-12 w-12 mx-auto mb-2" />
                      <p>Nenhuma temporada adicionada ainda.</p>
                      <p className="text-sm">Clique no botão acima para adicionar uma temporada.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {seasons.map((season) => (
                        <div key={season.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Temporada {season.number}</h3>
                            <div className="flex gap-2">
                              <Button 
                                type="button" 
                                onClick={() => addEpisode(season.id)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" /> Episódio
                              </Button>
                              <Button 
                                type="button" 
                                onClick={() => removeSeason(season.id)}
                                variant="destructive"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" /> Remover
                              </Button>
                            </div>
                          </div>
                          
                          <Separator className="mb-4" />
                          
                          {season.episodes.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              <p>Nenhum episódio adicionado nesta temporada.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {season.episodes.map((episode) => (
                                <div key={episode.id} className="border rounded-md p-3 bg-black/20">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">Episódio {episode.number}</h4>
                                    <Button 
                                      type="button" 
                                      onClick={() => removeEpisode(season.id, episode.id)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                    >
                                      <Trash2 className="h-3 w-3 text-gray-500" />
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-xs text-gray-500">Título</label>
                                      <Input 
                                        placeholder="Título do episódio"
                                        value={episode.title}
                                        onChange={(e) => updateEpisode(season.id, episode.id, 'title', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-gray-500">Duração (minutos)</label>
                                      <Input 
                                        type="number"
                                        placeholder="Duração em minutos"
                                        value={episode.duration === 0 ? '' : episode.duration}
                                        onChange={(e) => updateEpisode(season.id, episode.id, 'duration', parseInt(e.target.value) || 0)}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <label className="text-xs text-gray-500">Descrição</label>
                                    <Textarea 
                                      placeholder="Descrição do episódio"
                                      value={episode.description}
                                      onChange={(e) => updateEpisode(season.id, episode.id, 'description', e.target.value)}
                                      className="mt-1"
                                      rows={2}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit">
            {editMode ? 'Atualizar Conteúdo' : 'Adicionar Conteúdo'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContentForm;
