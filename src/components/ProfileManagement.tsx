
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfilesTab } from './profile-management/ProfilesTab';
import { ParentalControlTab } from './profile-management/ParentalControlTab';
import { ProfileFormDialog } from './profile-management/ProfileFormDialog';
import { DeleteProfileDialog } from './profile-management/DeleteProfileDialog';
import { PinDialog } from './profile-management/PinDialog';
import { useProfileManagement } from '@/hooks/use-profile-management';
import { useToast } from '@/hooks/use-toast';

const ProfileManagement = () => {
  const {
    profiles,
    maxProfiles,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isPinDialogOpen,
    setIsPinDialogOpen,
    currentProfile,
    editFormData,
    setEditFormData,
    pinFormData,
    setPinFormData,
    pinError,
    imagePreview,
    handleAddProfile,
    handleEditProfile,
    handleDeleteProfile,
    handleSetPin,
    openEditDialog,
    openDeleteDialog,
    openPinDialog,
    updateParentalControl,
    handleImageSelect
  } = useProfileManagement();
  
  const [activeTab, setActiveTab] = useState('profiles');
  const [darkMode, setDarkMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("John Doe");
  const { toast } = useToast();

  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDarkMode = savedMode 
      ? savedMode === 'dark' 
      : prefersDark;
    
    setDarkMode(shouldUseDarkMode);
    
    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'light');
    }
    
    toast({
      title: newMode ? "Modo escuro ativado" : "Modo claro ativado",
      description: "A aparência da interface foi alterada."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-3 border border-gray-600">
            <AvatarImage src="https://source.unsplash.com/random/100x100?face=1" />
            <AvatarFallback>{loggedInUser.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{loggedInUser}</span>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleDarkMode}
          className="border-gray-700 hover:bg-gray-800"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profiles">Gerenciar Perfis</TabsTrigger>
          <TabsTrigger value="parental">Controle Parental</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profiles" className="mt-6">
          <ProfilesTab 
            profiles={profiles}
            maxProfiles={maxProfiles}
            isAddDialogOpen={isAddDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
            onEditProfile={openEditDialog}
            onSetPin={openPinDialog}
            onDeleteProfile={openDeleteDialog}
          />
        </TabsContent>
        
        <TabsContent value="parental" className="mt-6 space-y-6">
          <ParentalControlTab 
            profiles={profiles}
            onUpdateParentalControl={updateParentalControl}
            onSwitchToProfilesTab={() => setActiveTab('profiles')}
            onOpenAddDialog={() => {
              setEditFormData({ name: '', isKids: true });
              setIsAddDialogOpen(true);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <ProfileFormDialog
          title="Adicionar novo perfil"
          description="Preencha as informações para criar um novo perfil."
          formData={editFormData}
          imagePreview={imagePreview}
          onFormDataChange={setEditFormData}
          onImageSelect={handleImageSelect}
          onSave={handleAddProfile}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <ProfileFormDialog
          title="Editar perfil"
          description="Faça alterações no perfil aqui."
          formData={editFormData}
          imagePreview={imagePreview}
          currentAvatar={currentProfile?.avatar}
          onFormDataChange={setEditFormData}
          onImageSelect={handleImageSelect}
          onSave={handleEditProfile}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteProfileDialog
          onDelete={handleDeleteProfile}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      </Dialog>
      
      <Dialog open={isPinDialogOpen} onOpenChange={(open) => {
        setIsPinDialogOpen(open);
        if (!open) setPinFormData({ pin: '', confirmPin: '' });
      }}>
        <PinDialog
          isChangingPin={currentProfile?.pin !== null}
          pinData={pinFormData}
          pinError={pinError}
          onPinDataChange={setPinFormData}
          onSavePin={handleSetPin}
          onCancel={() => setIsPinDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default ProfileManagement;
