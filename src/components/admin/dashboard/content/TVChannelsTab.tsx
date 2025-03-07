
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, Tv, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Channel categories
const CHANNEL_CATEGORIES = [
  "Entretenimento",
  "Esportes",
  "Notícias",
  "Filmes",
  "Documentários",
  "Infantil",
  "Música",
  "Educação",
  "Outro"
];

// Define Channel type
interface Channel {
  id: string;
  nome: string;
  logo_url: string | null;
  descricao: string | null;
  categoria: string | null;
  disponivel: boolean;
}

// Empty channel form state
const emptyChannel = {
  id: '',
  nome: '',
  logo_url: '',
  descricao: '',
  categoria: 'Entretenimento',
  disponivel: true
};

export default function TVChannelsTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<Channel>({ ...emptyChannel });
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch TV channels
  const { data: channels, isLoading, error } = useQuery({
    queryKey: ['tv-channels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canais_tv')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data as Channel[];
    }
  });

  // Add a new channel
  const addChannelMutation = useMutation({
    mutationFn: async (channel: Omit<Channel, 'id'>) => {
      const { data, error } = await supabase
        .from('canais_tv')
        .insert(channel)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tv-channels'] });
      setIsDialogOpen(false);
      setCurrentChannel({ ...emptyChannel });
      toast({
        title: "Canal adicionado",
        description: "O canal foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error adding channel:", error);
      toast({
        title: "Erro ao adicionar canal",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Update an existing channel
  const updateChannelMutation = useMutation({
    mutationFn: async (channel: Channel) => {
      const { data, error } = await supabase
        .from('canais_tv')
        .update({
          nome: channel.nome,
          logo_url: channel.logo_url,
          descricao: channel.descricao,
          categoria: channel.categoria,
          disponivel: channel.disponivel
        })
        .eq('id', channel.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tv-channels'] });
      setIsDialogOpen(false);
      setCurrentChannel({ ...emptyChannel });
      toast({
        title: "Canal atualizado",
        description: "O canal foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error updating channel:", error);
      toast({
        title: "Erro ao atualizar canal",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Delete a channel
  const deleteChannelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('canais_tv')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tv-channels'] });
      setIsDeleteDialogOpen(false);
      setChannelToDelete(null);
      toast({
        title: "Canal removido",
        description: "O canal foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error deleting channel:", error);
      toast({
        title: "Erro ao remover canal",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Toggle channel availability
  const toggleChannelStatusMutation = useMutation({
    mutationFn: async ({ id, disponivel }: { id: string; disponivel: boolean }) => {
      const { data, error } = await supabase
        .from('canais_tv')
        .update({ disponivel })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tv-channels'] });
      toast({
        title: "Status atualizado",
        description: "O status do canal foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Error updating channel status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentChannel.nome) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome do canal.",
        variant: "destructive",
      });
      return;
    }

    if (dialogMode === 'add') {
      // Remove id for new channels as it will be generated by the database
      const { id, ...newChannel } = currentChannel;
      addChannelMutation.mutate(newChannel);
    } else {
      updateChannelMutation.mutate(currentChannel);
    }
  };

  // Handle deletion confirmation
  const handleDeleteConfirm = () => {
    if (channelToDelete) {
      deleteChannelMutation.mutate(channelToDelete.id);
    }
  };

  // Add a new channel
  const addChannel = () => {
    setDialogMode('add');
    setCurrentChannel({ ...emptyChannel });
    setIsDialogOpen(true);
  };

  // Edit an existing channel
  const editChannel = (channel: Channel) => {
    setDialogMode('edit');
    setCurrentChannel({ ...channel });
    setIsDialogOpen(true);
  };

  // Delete a channel
  const deleteChannel = (channel: Channel) => {
    setChannelToDelete(channel);
    setIsDeleteDialogOpen(true);
  };

  // Toggle channel status
  const toggleChannelStatus = (channel: Channel) => {
    toggleChannelStatusMutation.mutate({
      id: channel.id,
      disponivel: !channel.disponivel
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Canais de TV</h2>
        <Button className="bg-primary dark:bg-violet-600" onClick={addChannel}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Canal
        </Button>
      </div>
      
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Canais Disponíveis</CardTitle>
          <CardDescription className="text-gray-400">
            Gerencie os canais de TV disponíveis na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center my-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-400">
              Erro ao carregar os canais. Tente novamente.
            </div>
          ) : channels && channels.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Categoria</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map((channel) => (
                    <tr key={channel.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="px-4 py-3 flex items-center">
                        <Tv className="mr-2 h-4 w-4 text-blue-400" />
                        {channel.nome}
                      </td>
                      <td className="px-4 py-3">
                        {channel.categoria || 'Não categorizado'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          channel.disponivel ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                        }`}>
                          {channel.disponivel ? 'Disponível' : 'Indisponível'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                            onClick={() => editChannel(channel)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className={`h-8 w-8 p-0 ${
                              channel.disponivel 
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                                : 'text-green-400 hover:text-green-300 hover:bg-green-900/30'
                            }`}
                            onClick={() => toggleChannelStatus(channel)}
                          >
                            {channel.disponivel ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                            onClick={() => deleteChannel(channel)}
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
          ) : (
            <div className="text-center py-10">
              <Tv className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum canal de TV cadastrado ainda.</p>
              <Button 
                className="mt-4 bg-primary/80 hover:bg-primary"
                onClick={addChannel}
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar Canal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Channel Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? 'Adicionar Canal' : 'Editar Canal'}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {dialogMode === 'add' 
                ? 'Preencha os dados para adicionar um novo canal de TV.' 
                : 'Atualize os dados do canal de TV.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={currentChannel.nome}
                  onChange={(e) => setCurrentChannel({...currentChannel, nome: e.target.value})}
                  placeholder="Nome do canal"
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="logo_url">URL do Logo</Label>
                <Input
                  id="logo_url"
                  value={currentChannel.logo_url || ''}
                  onChange={(e) => setCurrentChannel({...currentChannel, logo_url: e.target.value})}
                  placeholder="https://exemplo.com/logo.png"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={currentChannel.categoria || ''}
                  onValueChange={(value) => setCurrentChannel({...currentChannel, categoria: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {CHANNEL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={currentChannel.descricao || ''}
                  onChange={(e) => setCurrentChannel({...currentChannel, descricao: e.target.value})}
                  placeholder="Descrição do canal"
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="disponivel"
                  checked={currentChannel.disponivel}
                  onChange={(e) => setCurrentChannel({...currentChannel, disponivel: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="disponivel" className="cursor-pointer">Canal disponível</Label>
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
                disabled={addChannelMutation.isPending || updateChannelMutation.isPending}
              >
                {(addChannelMutation.isPending || updateChannelMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
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
              Tem certeza que deseja excluir o canal "{channelToDelete?.nome}"? Esta ação não pode ser desfeita.
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
              disabled={deleteChannelMutation.isPending}
            >
              {deleteChannelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
