import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Edit, Trash, MoreVertical, Eye, Star, Loader2, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ContentItem, Content } from '@/types/api';
import ContentForm from './ContentForm';
import { useContentManagement } from '@/hooks/use-content-management';

const MediaContentTab = () => {
  const { toast } = useToast();
  const { content, loading, error, fetchContent, deleteContent, toggleFeatured, updateContentStatus } = useContentManagement();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'filme' | 'serie'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendente' | 'aprovado' | 'rejeitado'>('all');
  const [filterDirectory, setFilterDirectory] = useState<string>('all');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  
  const directories = [
    'Netflix',
    'Prime Video',
    'Disney Plus',
    'Max',
    'Paramount Plus',
    'Globoplay',
    'Hulu',
    'Crunchyroll',
    'Cinema',
  ];
  
  const filteredContent = content
    .filter(item => 
      (filterType === 'all' || item.tipo === filterType) &&
      (filterStatus === 'all' || item.status === filterStatus) &&
      (filterDirectory === 'all' || item.metadata?.diretorio === filterDirectory) &&
      (searchTerm === '' || 
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
  const handleEditContent = (item: ContentItem) => {
    let durationNumber: number | null = null;
    
    if (item.duracao) {
      const durationMatch = item.duracao.match(/\d+/g);
      if (durationMatch && durationMatch.length > 0) {
        durationNumber = parseInt(durationMatch[0]);
      }
    }
    
    const contentToEdit: ContentItem = {
      ...item,
      duracao: durationNumber,
    };
    
    setSelectedContent(contentToEdit);
    setIsFormDialogOpen(true);
  };
  
  const handleDeleteClick = (item: ContentItem) => {
    setSelectedContent(item);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedContent) return;
    
    const success = await deleteContent(selectedContent.id);
    
    if (success) {
      toast({
        title: "Conteúdo excluído",
        description: `${selectedContent.titulo} foi removido com sucesso.`,
      });
    } else {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o conteúdo. Tente novamente.",
        variant: "destructive",
      });
    }
    
    setIsDeleteDialogOpen(false);
  };
  
  const handleFormSubmit = () => {
    setIsFormDialogOpen(false);
    setSelectedContent(null);
    fetchContent();
  };
  
  const handleToggleFeatured = async (item: ContentItem) => {
    const newFeaturedState = !item.destaque;
    const success = await toggleFeatured(item.id, newFeaturedState);
    
    if (success) {
      toast({
        title: newFeaturedState ? "Adicionado aos destaques" : "Removido dos destaques",
        description: `${item.titulo} foi ${newFeaturedState ? 'adicionado aos' : 'removido dos'} destaques.`,
      });
    } else {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status de destaque. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleStatusChange = async (item: ContentItem, status: 'pendente' | 'aprovado' | 'rejeitado') => {
    const success = await updateContentStatus(item.id, status);
    
    if (success) {
      toast({
        title: `Status atualizado para ${status}`,
        description: `${item.titulo} foi ${status === 'aprovado' ? 'aprovado' : status === 'rejeitado' ? 'rejeitado' : 'marcado como pendente'}.`,
      });
    } else {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'aprovado':
        return <Badge className="bg-green-600 hover:bg-green-700">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge className="bg-red-600 hover:bg-red-700">Rejeitado</Badge>;
      case 'pendente':
      default:
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pendente</Badge>;
    }
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <p className="text-lg text-red-500 mb-4">Erro ao carregar conteúdos</p>
        <Button onClick={fetchContent}>Tentar Novamente</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Filmes e Séries</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gerencie o catálogo de filmes e séries disponíveis na plataforma
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Input
            placeholder="Buscar conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-[300px]"
          />
          
          <Select value={filterType} onValueChange={(value: 'all' | 'filme' | 'serie') => setFilterType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="filme">Apenas Filmes</SelectItem>
              <SelectItem value="serie">Apenas Séries</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={(value: 'all' | 'pendente' | 'aprovado' | 'rejeitado') => setFilterStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterDirectory} onValueChange={(value) => setFilterDirectory(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por diretório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os diretórios</SelectItem>
              {directories.map(dir => (
                <SelectItem key={dir} value={dir}>{dir}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 border rounded border-dashed">
          <p className="text-lg mb-4">Nenhum conteúdo encontrado</p>
          <Button onClick={() => setIsFormDialogOpen(true)}>Adicionar Conteúdo</Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead>Diretório</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.titulo}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.tipo === 'filme' ? 'Filme' : 
                       item.tipo === 'serie' ? 'Série' : 'Documentário'}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.ano_lancamento}</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-600 hover:bg-yellow-700">
                      {item.classificacao_etaria}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.metadata?.diretorio || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.destaque ? "default" : "outline"} 
                      className={item.destaque ? "bg-purple-600 hover:bg-purple-700" : ""}>
                      {item.destaque ? 'Destaque' : 'Normal'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditContent(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(item, 'aprovado')}>
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          Aprovar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(item, 'rejeitado')}>
                          <X className="mr-2 h-4 w-4 text-red-600" />
                          Rejeitar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(item)}>
                          <Star className="mr-2 h-4 w-4" />
                          {item.destaque ? 'Remover Destaque' : 'Adicionar Destaque'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-6xl bg-gray-900 border-gray-800 p-0">
          <ContentForm 
            contentType={selectedContent?.tipo === 'serie' ? 'Série' : 'Filme'}
            initialData={selectedContent}
            onCancel={() => {
              setIsFormDialogOpen(false);
              setSelectedContent(null);
            }}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conteúdo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{selectedContent?.titulo}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaContentTab;
