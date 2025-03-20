
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, Film, Tv, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock content data for demonstration
const mockMovies = [
  { id: 1, title: "O Poderoso Chefão", type: "filme", category: "Drama", year: 1972, status: "active", videoUrl480p: "https://exemplo.com/poderoso-chefao-480p.mp4", videoUrl720p: "https://exemplo.com/poderoso-chefao-720p.mp4", videoUrl1080p: "https://exemplo.com/poderoso-chefao-1080p.mp4" },
  { id: 2, title: "Cidade de Deus", type: "filme", category: "Drama", year: 2002, status: "active", videoUrl480p: "https://exemplo.com/cidade-deus-480p.mp4", videoUrl720p: "https://exemplo.com/cidade-deus-720p.mp4", videoUrl1080p: "https://exemplo.com/cidade-deus-1080p.mp4" },
  { id: 3, title: "Pantera Negra", type: "filme", category: "Ação", year: 2018, status: "active", videoUrl480p: "https://exemplo.com/pantera-negra-480p.mp4", videoUrl720p: "https://exemplo.com/pantera-negra-720p.mp4", videoUrl1080p: "https://exemplo.com/pantera-negra-1080p.mp4" },
  { id: 4, title: "Toy Story", type: "filme", category: "Animação", year: 1995, status: "active", videoUrl480p: "https://exemplo.com/toy-story-480p.mp4", videoUrl720p: "https://exemplo.com/toy-story-720p.mp4", videoUrl1080p: "https://exemplo.com/toy-story-1080p.mp4" },
  { id: 5, title: "Parasita", type: "filme", category: "Drama", year: 2019, status: "active", videoUrl480p: "https://exemplo.com/parasita-480p.mp4", videoUrl720p: "https://exemplo.com/parasita-720p.mp4", videoUrl1080p: "https://exemplo.com/parasita-1080p.mp4" },
];

const mockSeries = [
  { id: 1, title: "Breaking Bad", type: "série", category: "Drama", year: 2008, status: "active", videoUrl480p: "https://exemplo.com/breaking-bad-480p.mp4", videoUrl720p: "https://exemplo.com/breaking-bad-720p.mp4", videoUrl1080p: "https://exemplo.com/breaking-bad-1080p.mp4" },
  { id: 2, title: "The Boys", type: "série", category: "Ação", year: 2019, status: "active", videoUrl480p: "https://exemplo.com/the-boys-480p.mp4", videoUrl720p: "https://exemplo.com/the-boys-720p.mp4", videoUrl1080p: "https://exemplo.com/the-boys-1080p.mp4" },
  { id: 3, title: "Stranger Things", type: "série", category: "Ficção Científica", year: 2016, status: "active", videoUrl480p: "https://exemplo.com/stranger-things-480p.mp4", videoUrl720p: "https://exemplo.com/stranger-things-720p.mp4", videoUrl1080p: "https://exemplo.com/stranger-things-1080p.mp4" },
  { id: 4, title: "Game of Thrones", type: "série", category: "Fantasia", year: 2011, status: "active", videoUrl480p: "https://exemplo.com/got-480p.mp4", videoUrl720p: "https://exemplo.com/got-720p.mp4", videoUrl1080p: "https://exemplo.com/got-1080p.mp4" },
  { id: 5, title: "The Crown", type: "série", category: "Drama", year: 2016, status: "active", videoUrl480p: "https://exemplo.com/the-crown-480p.mp4", videoUrl720p: "https://exemplo.com/the-crown-720p.mp4", videoUrl1080p: "https://exemplo.com/the-crown-1080p.mp4" },
];

// Content categories
const CONTENT_CATEGORIES = [
  "Ação",
  "Aventura",
  "Comédia",
  "Drama",
  "Ficção Científica",
  "Terror",
  "Suspense",
  "Romance",
  "Animação",
  "Documentário",
  "Fantasia",
  "Musical",
  "Biografia",
  "Crime",
  "Esporte",
  "História",
  "Guerra",
  "Faroeste",
  "Família",
  "Outro"
];

// Content rating options
const CONTENT_RATINGS = [
  "L",
  "10",
  "12",
  "14",
  "16",
  "18"
];

export default function MediaContentTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [contentToDelete, setContentToDelete] = useState<any | null>(null);
  const { toast } = useToast();

  // Form state for new/edit content
  const [contentForm, setContentForm] = useState({
    id: '',
    title: '',
    type: 'filme',
    category: '',
    year: new Date().getFullYear(),
    status: 'active',
    description: '',
    rating: '12',
    duration: 0,
    isFree: false,
    videoUrl480p: '',
    videoUrl720p: '',
    videoUrl1080p: ''
  });

  // Add a new content
  const addContent = () => {
    setDialogMode('add');
    setContentForm({
      id: '',
      title: '',
      type: 'filme',
      category: '',
      year: new Date().getFullYear(),
      status: 'active',
      description: '',
      rating: '12',
      duration: 0,
      isFree: false,
      videoUrl480p: '',
      videoUrl720p: '',
      videoUrl1080p: ''
    });
    setIsDialogOpen(true);
  };

  // Edit existing content
  const editContent = (content: any) => {
    setDialogMode('edit');
    setContentForm({
      id: content.id,
      title: content.title,
      type: content.type,
      category: content.category,
      year: content.year,
      status: content.status,
      description: content.description || '',
      rating: content.rating || '12',
      duration: content.duration || 0,
      isFree: content.isFree || false,
      videoUrl480p: content.videoUrl480p || '',
      videoUrl720p: content.videoUrl720p || '',
      videoUrl1080p: content.videoUrl1080p || ''
    });
    setIsDialogOpen(true);
  };

  // Delete content
  const deleteContent = (content: any) => {
    setContentToDelete(content);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentForm.title || !contentForm.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Verifica se pelo menos uma URL de vídeo foi fornecida
    if (!contentForm.videoUrl480p && !contentForm.videoUrl720p && !contentForm.videoUrl1080p) {
      toast({
        title: "URLs de vídeo",
        description: "Por favor, forneça pelo menos uma URL de vídeo.",
        variant: "destructive",
      });
      return;
    }

    // Here you would handle API calls to save the content
    toast({
      title: dialogMode === 'add' ? "Conteúdo adicionado" : "Conteúdo atualizado",
      description: `O ${contentForm.type} foi ${dialogMode === 'add' ? 'adicionado' : 'atualizado'} com sucesso.`,
    });
    
    setIsDialogOpen(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!contentToDelete) return;
    
    // Here you would handle API calls to delete the content
    toast({
      title: "Conteúdo removido",
      description: `O ${contentToDelete.type} foi removido com sucesso.`,
    });
    
    setIsDeleteDialogOpen(false);
    setContentToDelete(null);
  };

  // Verifica URLs de vídeo e exibe badge de qualidade
  const getQualityBadges = (content: any) => {
    const badges = [];
    
    if (content.videoUrl1080p) {
      badges.push(
        <span key="1080p" className="ml-1 px-1.5 py-0.5 text-[10px] bg-blue-900 text-blue-300 rounded-sm">
          1080p
        </span>
      );
    }
    
    if (content.videoUrl720p) {
      badges.push(
        <span key="720p" className="ml-1 px-1.5 py-0.5 text-[10px] bg-green-900 text-green-300 rounded-sm">
          720p
        </span>
      );
    }
    
    if (content.videoUrl480p) {
      badges.push(
        <span key="480p" className="ml-1 px-1.5 py-0.5 text-[10px] bg-gray-700 text-gray-300 rounded-sm">
          480p
        </span>
      );
    }
    
    return badges;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Filmes e Séries</h2>
        <Button onClick={addContent} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Conteúdo
        </Button>
      </div>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Conteúdo Disponível</CardTitle>
          <CardDescription className="text-gray-400">
            Gerencie o conteúdo disponível na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left">Título</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-left">Categoria</th>
                  <th className="px-4 py-3 text-left">Ano</th>
                  <th className="px-4 py-3 text-left">Qualidade</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {[...mockMovies, ...mockSeries].map((content) => (
                  <tr key={content.id} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="px-4 py-3 flex items-center">
                      {content.type === 'filme' ? 
                        <Film className="mr-2 h-4 w-4 text-blue-400" /> : 
                        <Tv className="mr-2 h-4 w-4 text-green-400" />
                      }
                      {content.title}
                    </td>
                    <td className="px-4 py-3">
                      {content.type === 'filme' ? 'Filme' : 'Série'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        content.type === 'filme' ? 'bg-blue-900 text-blue-400' : 'bg-green-900 text-green-400'
                      }`}>
                        {content.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">{content.year}</td>
                    <td className="px-4 py-3 flex">
                      {getQualityBadges(content)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                          onClick={() => editContent(content)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                          onClick={() => deleteContent(content)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Content Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? `Adicionar ${contentForm.type === 'filme' ? 'Filme' : 'Série'}` : `Editar ${contentForm.type === 'filme' ? 'Filme' : 'Série'}`}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {dialogMode === 'add' 
                ? `Preencha os dados para adicionar um novo ${contentForm.type === 'filme' ? 'filme' : 'série'}.` 
                : `Atualize os dados do ${contentForm.type === 'filme' ? 'filme' : 'série'}.`}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={contentForm.title}
                  onChange={(e) => setContentForm({...contentForm, title: e.target.value})}
                  placeholder="Título do conteúdo"
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={contentForm.type}
                  onValueChange={(value: 'filme' | 'série') => setContentForm({...contentForm, type: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="filme">Filme</SelectItem>
                    <SelectItem value="série">Série</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={contentForm.category}
                  onValueChange={(value) => setContentForm({...contentForm, category: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {CONTENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="year">Ano de Lançamento</Label>
                <Input
                  id="year"
                  type="number"
                  value={contentForm.year}
                  onChange={(e) => setContentForm({...contentForm, year: parseInt(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                  min={1900}
                  max={new Date().getFullYear() + 10}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rating">Classificação Etária</Label>
                <Select
                  value={contentForm.rating}
                  onValueChange={(value) => setContentForm({...contentForm, rating: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione uma classificação" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {CONTENT_RATINGS.map((rating) => (
                      <SelectItem key={rating} value={rating}>
                        {rating === 'L' ? 'Livre' : rating + ' anos'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={contentForm.duration}
                  onChange={(e) => setContentForm({...contentForm, duration: parseInt(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                  min={1}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={contentForm.description}
                  onChange={(e) => setContentForm({...contentForm, description: e.target.value})}
                  placeholder="Descrição do conteúdo"
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                />
              </div>

              {/* Video Quality URLs - Section with border and heading */}
              <div className="space-y-4 border border-gray-700 rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Links de Vídeo por Qualidade</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl480p">URL do Vídeo (480p)</Label>
                  <Input
                    id="videoUrl480p"
                    value={contentForm.videoUrl480p}
                    onChange={(e) => setContentForm({...contentForm, videoUrl480p: e.target.value})}
                    placeholder="Ex: https://exemplo.com/video-480p.mp4"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl720p">URL do Vídeo (720p)</Label>
                  <Input
                    id="videoUrl720p"
                    value={contentForm.videoUrl720p}
                    onChange={(e) => setContentForm({...contentForm, videoUrl720p: e.target.value})}
                    placeholder="Ex: https://exemplo.com/video-720p.mp4"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl1080p">URL do Vídeo (1080p)</Label>
                  <Input
                    id="videoUrl1080p"
                    value={contentForm.videoUrl1080p}
                    onChange={(e) => setContentForm({...contentForm, videoUrl1080p: e.target.value})}
                    placeholder="Ex: https://exemplo.com/video-1080p.mp4"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={contentForm.isFree}
                  onChange={(e) => setContentForm({...contentForm, isFree: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isFree" className="cursor-pointer">Conteúdo gratuito</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90"
              >
                {dialogMode === 'add' ? 'Adicionar' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir "{contentToDelete?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
