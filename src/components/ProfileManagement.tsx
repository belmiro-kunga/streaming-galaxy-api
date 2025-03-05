
import React, { useState } from 'react';
import { Pencil, Trash2, Plus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ParentalControlSettings } from './ParentalControlSettings';

// Mock data for profiles
const initialProfiles = [
  { 
    id: '1', 
    name: 'Usuário Principal', 
    avatar: 'https://source.unsplash.com/random/100x100?face=1', 
    isKids: false,
    isActive: true,
    canEdit: false,
    canDelete: false,
    parentalControl: {
      enabled: false,
      maxRating: '16',
      timeRestrictions: []
    }
  },
  { 
    id: '2', 
    name: 'Filho', 
    avatar: 'https://source.unsplash.com/random/100x100?face=2', 
    isKids: true,
    isActive: true,
    canEdit: true,
    canDelete: true,
    parentalControl: {
      enabled: true,
      maxRating: '10',
      timeRestrictions: [
        { dayOfWeek: 'weekdays', startTime: '16:00', endTime: '19:00' }
      ]
    }
  }
];

const ProfileManagement = () => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ name: '', isKids: false });
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profiles');

  // Subscription plan determines how many profiles can be created
  const maxProfiles = 5; // Based on Premium plan

  const handleAddProfile = () => {
    if (profiles.length >= maxProfiles) {
      toast({
        title: "Limite atingido",
        description: "Seu plano permite no máximo " + maxProfiles + " perfis.",
        variant: "destructive"
      });
      return;
    }

    const newProfile = {
      id: Date.now().toString(),
      name: editFormData.name,
      avatar: `https://source.unsplash.com/random/100x100?face=${profiles.length + 1}`,
      isKids: editFormData.isKids,
      isActive: true,
      canEdit: true,
      canDelete: true,
      parentalControl: {
        enabled: editFormData.isKids,
        maxRating: editFormData.isKids ? '10' : '16',
        timeRestrictions: []
      }
    };

    setProfiles([...profiles, newProfile]);
    setEditFormData({ name: '', isKids: false });
    setIsAddDialogOpen(false);

    toast({
      title: "Perfil adicionado",
      description: `Perfil ${newProfile.name} foi criado com sucesso.`
    });
  };

  const handleEditProfile = () => {
    if (!currentProfile) return;

    const updatedProfiles = profiles.map(profile => {
      if (profile.id === currentProfile.id) {
        return {
          ...profile,
          name: editFormData.name,
          isKids: editFormData.isKids,
          parentalControl: {
            ...profile.parentalControl,
            enabled: editFormData.isKids ? true : profile.parentalControl.enabled
          }
        };
      }
      return profile;
    });

    setProfiles(updatedProfiles);
    setIsEditDialogOpen(false);
    toast({
      title: "Perfil atualizado",
      description: `Perfil ${editFormData.name} foi atualizado com sucesso.`
    });
  };

  const handleDeleteProfile = () => {
    if (!currentProfile) return;

    const updatedProfiles = profiles.filter(profile => profile.id !== currentProfile.id);
    setProfiles(updatedProfiles);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Perfil excluído",
      description: `Perfil ${currentProfile.name} foi excluído com sucesso.`
    });
  };

  const openEditDialog = (profile: any) => {
    setCurrentProfile(profile);
    setEditFormData({ name: profile.name, isKids: profile.isKids });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (profile: any) => {
    setCurrentProfile(profile);
    setIsDeleteDialogOpen(true);
  };

  const updateParentalControl = (profileId: string, settings: any) => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          parentalControl: settings
        };
      }
      return profile;
    });

    setProfiles(updatedProfiles);
    toast({
      title: "Controle parental atualizado",
      description: "As configurações de controle parental foram atualizadas com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profiles">Gerenciar Perfis</TabsTrigger>
          <TabsTrigger value="parental">Controle Parental</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profiles" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Gerenciar Perfis</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-gray-800">
                <DialogHeader>
                  <DialogTitle>Adicionar novo perfil</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Preencha as informações para criar um novo perfil.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      value={editFormData.name} 
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="kids-mode" 
                      checked={editFormData.isKids}
                      onCheckedChange={(checked) => setEditFormData({ ...editFormData, isKids: checked })}
                    />
                    <Label htmlFor="kids-mode">Perfil infantil</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-700 hover:bg-gray-800">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddProfile}>Criar perfil</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <Card key={profile.id} className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-16 w-16 mr-4 border-2 border-gray-700">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{profile.name}</h3>
                      {profile.isKids && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                          <Lock className="h-3 w-3 mr-1" />
                          Infantil
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    {profile.canEdit && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-gray-700 hover:bg-gray-800"
                        onClick={() => openEditDialog(profile)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                    
                    {profile.canDelete && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-gray-700 hover:bg-red-900/20 text-red-400"
                        onClick={() => openDeleteDialog(profile)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {profiles.length < maxProfiles && (
              <Card className="bg-gray-900/30 border-gray-800 border-dashed hover:border-gray-700 transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full cursor-pointer" onClick={() => setIsAddDialogOpen(true)}>
                  <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-center">Adicionar perfil</p>
                  <p className="text-gray-500 text-xs text-center mt-1">
                    {maxProfiles - profiles.length} perfil(is) restante(s)
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="parental" className="mt-6 space-y-6">
          <h2 className="text-xl font-bold mb-4">Configurações de Controle Parental</h2>
          
          {profiles.filter(profile => profile.isKids).length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-semibold mb-2">Nenhum perfil infantil encontrado</h3>
              <p className="text-gray-400 mb-4">
                Adicione um perfil infantil para configurar o controle parental.
              </p>
              <Button onClick={() => {
                setActiveTab('profiles');
                setIsAddDialogOpen(true);
                setEditFormData({ name: '', isKids: true });
              }}>
                Adicionar perfil infantil
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {profiles.filter(profile => profile.isKids).map(profile => (
                <ParentalControlSettings 
                  key={profile.id}
                  profile={profile}
                  onUpdate={(settings) => updateParentalControl(profile.id, settings)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription className="text-gray-400">
              Faça alterações no perfil aqui.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input 
                id="edit-name" 
                value={editFormData.name} 
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-kids-mode" 
                checked={editFormData.isKids}
                onCheckedChange={(checked) => setEditFormData({ ...editFormData, isKids: checked })}
              />
              <Label htmlFor="edit-kids-mode">Perfil infantil</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gray-700 hover:bg-gray-800">
              Cancelar
            </Button>
            <Button onClick={handleEditProfile}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Excluir perfil</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o perfil? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-gray-700 hover:bg-gray-800">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProfile}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileManagement;
