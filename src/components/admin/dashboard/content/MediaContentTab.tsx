import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, Film, Tv, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock content data for demonstration
const mockMovies = [
  { id: 1, title: "O Poderoso Chefão", type: "filme", category: "Drama", year: 1972, status: "active" },
  { id: 2, title: "Cidade de Deus", type: "filme", category: "Drama", year: 2002, status: "active" },
  { id: 3, title: "Pantera Negra", type: "filme", category: "Ação", year: 2018, status: "active" },
  { id: 4, title: "Toy Story", type: "filme", category: "Animação", year: 1995, status: "active" },
  { id: 5, title: "Parasita", type: "filme", category: "Drama", year: 2019, status: "active" },
];

const mockSeries = [
  { id: 1, title: "Breaking Bad", type: "série", category: "Drama", year: 2008, status: "active" },
  { id: 2, title: "The Boys", type: "série", category: "Ação", year: 2019, status: "active" },
  { id: 3, title: "Stranger Things", type: "série", category: "Ficção Científica", year: 2016, status: "active" },
  { id: 4, title: "Game of Thrones", type: "série", category: "Fantasia", year: 2011, status: "active" },
  { id: 5, title: "The Crown", type: "série", category: "Drama", year: 2016, status: "active" },
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
  const [activeTab, setActiveTab] = useState("movies");
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
    isFree: false
  });

  // Add a new content
  const addContent = () => {
    setDialogMode('add');
    setContentForm({
      id: '',
      title: '',
      type: activeTab === 'movies' ? 'filme' : 'série',
      category: '',
      year: new Date().getFullYear(),
      status: 'active',
      description: '',
      rating: '12',
      duration: 0,
      isFree: false
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
      description: '',
      rating: '12',
      duration: 0,
      isFree: false
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Filmes e Séries</h2>
        <Button className="bg-primary dark:bg-violet-600" onClick={addContent}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar {activeTab === 'movies' ? 'Filme' : 'Série'}
        </Button>
      </div>
      
      <Tabs defaultValue="movies" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-gray-800 mb-6">
          <TabsTrigger value="movies" className="flex-1">Filmes</TabsTrigger>
          <TabsTrigger value="series" className="flex-1">Séries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="movies">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Filmes Disponíveis</CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie os filmes disponíveis na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left">Título</th>
                      <th className="px-4 py-3 text-left">Categoria</th>
                      <th className="px-4 py-3 text-left">Ano</th>
                      <th className="px-4 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMovies.map((movie) => (
                      <tr key={movie.id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="px-4 py-3 flex items-center">
                          <Film className="mr-2 h-4 w-4 text-blue-400" />
                          {movie.title}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-400">
                            {movie.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">{movie.year}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                              onClick={() => editContent(movie)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                              onClick={() => deleteContent(movie)}
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
        </TabsContent>
        
        <TabsContent value="series">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Séries Disponíveis</CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie as séries disponíveis na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left">Título</th>
                      <th className="px-4 py-3 text-left">Categoria</th>
                      <th className="px-4 py-3 text-left">Ano</th>
                      <th className="px-4 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSeries.map((serie) => (
                      <tr key={serie.id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="px-4 py-3 flex items-center">
                          <Tv className="mr-2 h-4 w-4 text-green-400" />
                          {serie.title}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-900 text-green-400">
                            {serie.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">{serie.year}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                              onClick={() => editContent(serie)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                              onClick={() => deleteContent(serie)}
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
        </TabsContent>
      </Tabs>

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
