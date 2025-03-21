import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Content, Genre } from '@/types/api';
import { contentAPI } from '@/services/content/contentAPI';
import VideoQualityInputs from './VideoQualityInputs';
import EpisodeVideoInputs from './EpisodeVideoInputs';
import { toast } from 'sonner';

const formSchema = z.object({
  titulo: z.string().min(2, 'O título deve ter pelo menos 2 caracteres'),
  tipo: z.enum(['filme', 'serie', 'documentario']),
  descricao: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  ano_lancamento: z.number().int().min(1900).max(new Date().getFullYear() + 5),
  classificacao_etaria: z.string(),
  gratuito: z.boolean().default(false),
  status: z.enum(['pendente', 'ativo', 'inativo']).default('pendente'),
  generos: z.array(z.string()).min(1, 'Selecione pelo menos um gênero'),
  duracao: z.number().int().min(1).optional(),
  poster_url: z.string().url('URL inválida').optional().or(z.literal('')),
  backdrop_url: z.string().url('URL inválida').optional().or(z.literal('')),
  trailer_url: z.string().url('URL inválida').optional().or(z.literal('')),
  video_url_480p: z.string().url('URL inválida').optional().or(z.literal('')),
  video_url_720p: z.string().url('URL inválida').optional().or(z.literal('')),
  video_url_1080p: z.string().url('URL inválida').optional().or(z.literal('')),
  destaque: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface ContentFormProps {
  contentType: 'Filme' | 'Série' | 'Documentário';
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData?: Partial<Content>;
}

const ContentForm: React.FC<ContentFormProps> = ({ 
  contentType = 'Filme', 
  onCancel, 
  onSubmit,
  initialData 
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialData?.generos?.map(g => g.id) || []
  );

  // Fetch genres when component mounts
  React.useEffect(() => {
    const loadGenres = async () => {
      const genres = await contentAPI.getAllGenres();
      setAvailableGenres(genres);
    };
    
    loadGenres();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: initialData?.titulo || '',
      tipo: (initialData?.tipo as any) || contentType.toLowerCase() as any,
      descricao: initialData?.descricao || '',
      ano_lancamento: initialData?.ano_lancamento || new Date().getFullYear(),
      classificacao_etaria: initialData?.classificacao_etaria || 'L',
      gratuito: initialData?.gratuito || false,
      status: initialData?.status as any || 'pendente',
      generos: initialData?.generos?.map(g => g.id) || [],
      duracao: initialData?.duracao || undefined,
      poster_url: initialData?.poster_url || '',
      backdrop_url: initialData?.backdrop_url || '',
      trailer_url: initialData?.trailer_url || '',
      video_url_480p: initialData?.video_url_480p || '',
      video_url_720p: initialData?.video_url_720p || '',
      video_url_1080p: initialData?.video_url_1080p || '',
      destaque: initialData?.destaque || false,
    }
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      // Combine form values with any initialData (like ID) for updates
      const contentData = {
        ...initialData,
        ...values,
        generos: selectedGenres
      };
      
      // Call the API to save the content
      await contentAPI.saveContent(contentData);
      
      toast.success(`${contentType} salvo com sucesso!`);
      onSubmit(contentData);
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      toast.error(`Erro ao salvar ${contentType.toLowerCase()}`);
    }
  };

  const handleGenreChange = (genreId: string, checked: boolean) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genreId]);
    } else {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    }
  };

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">
        {initialData?.id ? `Editar ${contentType}` : `Adicionar Novo ${contentType}`}
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-gray-800">
          <TabsTrigger value="info">Informações Básicas</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          {contentType === 'Série' && (
            <TabsTrigger value="episodes">Episódios</TabsTrigger>
          )}
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <TabsContent value="info" className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do conteúdo" {...field} className="bg-gray-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800">
                        <SelectItem value="filme">Filme</SelectItem>
                        <SelectItem value="serie">Série</SelectItem>
                        <SelectItem value="documentario">Documentário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição do conteúdo" 
                        {...field} 
                        className="bg-gray-800 min-h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ano_lancamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano de Lançamento</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          className="bg-gray-800" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duracao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (minutos)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="120" 
                          {...field}
                          value={field.value || ''}
                          onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                          className="bg-gray-800" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="classificacao_etaria"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Classificação Etária</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        {['L', '10', '12', '14', '16', '18'].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <RadioGroupItem value={rating} id={`rating-${rating}`} />
                            <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                              {rating === 'L' ? 'Livre' : `${rating} anos`}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gratuito"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Conteúdo Gratuito</FormLabel>
                        <p className="text-sm text-gray-400">
                          Disponível para todos os usuários, mesmo sem assinatura
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destaque"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Destaque na Home</FormLabel>
                        <p className="text-sm text-gray-400">
                          Exibir este conteúdo em destaque na página inicial
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800">
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="poster_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Poster</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-gray-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="backdrop_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Backdrop</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-gray-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="trailer_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Trailer</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/..." {...field} className="bg-gray-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border border-gray-700 rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium">URLs dos Vídeos por Qualidade</h3>
                <p className="text-sm text-gray-400">
                  Forneça os links para as diferentes qualidades do vídeo.
                </p>
                
                <FormField
                  control={form.control}
                  name="video_url_480p"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vídeo 480p</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-gray-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="video_url_720p"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vídeo 720p</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-gray-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="video_url_1080p"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vídeo 1080p</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-gray-800" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="categories">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Gêneros</h3>
                <p className="text-sm text-gray-400">
                  Selecione os gêneros associados a este conteúdo
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableGenres.map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`genre-${genre.id}`} 
                        checked={selectedGenres.includes(genre.id)}
                        onCheckedChange={(checked) => 
                          handleGenreChange(genre.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`genre-${genre.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {genre.nome}
                      </label>
                    </div>
                  ))}
                </div>
                
                {form.formState.errors.generos && (
                  <p className="text-sm font-medium text-red-500">
                    {form.formState.errors.generos.message}
                  </p>
                )}
              </div>
            </TabsContent>
            
            {contentType === 'Série' && (
            <TabsContent value="episodes">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Episódios</h3>
                <p className="text-sm text-gray-400">
                  Gerencie os episódios desta série
                </p>
                
                <EpisodeVideoInputs 
                  videoUrl480p=""
                  videoUrl720p=""
                  videoUrl1080p=""
                  onVideoUrlChange={() => {}}
                  onPreviewVideo={() => {}}
                />
              </div>
            </TabsContent>
          )}
            
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {initialData?.id ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </Tabs>
  </div>
};

export default ContentForm;
