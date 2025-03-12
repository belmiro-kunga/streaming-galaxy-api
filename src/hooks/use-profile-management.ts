
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Initial profiles data
const initialProfiles = [
  { 
    id: '1', 
    name: 'Usuário Principal', 
    avatar: 'https://source.unsplash.com/random/100x100?face=1', 
    isKids: false,
    isActive: true,
    canEdit: false,
    canDelete: false,
    pin: null,
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
    pin: null,
    parentalControl: {
      enabled: true,
      maxRating: '10',
      timeRestrictions: [
        { dayOfWeek: 'weekdays', startTime: '16:00', endTime: '19:00' }
      ]
    }
  }
];

export const useProfileManagement = () => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ name: '', isKids: false });
  const [pinFormData, setPinFormData] = useState({ pin: '', confirmPin: '' });
  const [pinError, setPinError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // Maximum number of profiles allowed
  const maxProfiles = 5;

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
      avatar: imagePreview || `https://source.unsplash.com/random/100x100?face=${profiles.length + 1}`,
      isKids: editFormData.isKids,
      isActive: true,
      canEdit: true,
      canDelete: true,
      pin: null,
      parentalControl: {
        enabled: editFormData.isKids,
        maxRating: editFormData.isKids ? '10' : '16',
        timeRestrictions: []
      }
    };

    setProfiles([...profiles, newProfile]);
    setEditFormData({ name: '', isKids: false });
    setImagePreview(null);
    setSelectedFile(null);
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
          avatar: imagePreview || profile.avatar,
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
    setImagePreview(null);
    setSelectedFile(null);
    
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

  const handleSetPin = () => {
    if (!currentProfile) return;
    
    // Validate PIN
    if (pinFormData.pin.length < 4) {
      setPinError('O PIN deve ter pelo menos 4 dígitos');
      return;
    }
    
    if (pinFormData.pin !== pinFormData.confirmPin) {
      setPinError('Os PINs não correspondem');
      return;
    }
    
    const updatedProfiles = profiles.map(profile => {
      if (profile.id === currentProfile.id) {
        return {
          ...profile,
          pin: pinFormData.pin
        };
      }
      return profile;
    });

    setProfiles(updatedProfiles);
    setIsPinDialogOpen(false);
    setPinFormData({ pin: '', confirmPin: '' });
    setPinError('');
    
    toast({
      title: "PIN configurado",
      description: `PIN para o perfil ${currentProfile.name} foi configurado com sucesso.`
    });
  };

  const openEditDialog = (profile: any) => {
    setCurrentProfile(profile);
    setEditFormData({ name: profile.name, isKids: profile.isKids });
    setImagePreview(null);
    setSelectedFile(null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (profile: any) => {
    setCurrentProfile(profile);
    setIsDeleteDialogOpen(true);
  };

  const openPinDialog = (profile: any) => {
    if (profile.isKids) {
      toast({
        title: "Operação não permitida",
        description: "Não é possível definir PIN para perfis infantis.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentProfile(profile);
    setPinFormData({ pin: '', confirmPin: '' });
    setPinError('');
    setIsPinDialogOpen(true);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSelectedFile(file);
      };
      
      reader.readAsDataURL(file);
    }
  };

  return {
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
    setPinError,
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
  };
};
