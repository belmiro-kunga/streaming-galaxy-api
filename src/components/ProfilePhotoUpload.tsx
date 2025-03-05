
import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpload: (photoUrl: string) => void;
  name: string;
}

const ProfilePhotoUpload = ({ currentPhotoUrl, onPhotoUpload, name }: ProfilePhotoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter menos de 5MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie apenas arquivos de imagem",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Create a URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Simulate upload (in a real app, you'd upload to a server/Supabase storage)
    setTimeout(() => {
      setIsUploading(false);
      onPhotoUpload(objectUrl);
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso",
      });
    }, 1500);
  };
  
  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onPhotoUpload('');
    toast({
      title: "Foto removida",
      description: "Sua foto de perfil foi removida",
    });
  };
  
  // Create initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <Avatar className="w-24 h-24 border-4 border-primary/30">
          <AvatarImage src={previewUrl || undefined} />
          <AvatarFallback className="text-xl">{getInitials(name)}</AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {previewUrl && !isUploading && (
          <button 
            onClick={handleRemovePhoto}
            className="absolute -top-2 -right-2 rounded-full bg-destructive text-white p-1"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex space-x-2">
        <label className="cursor-pointer">
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="flex items-center"
            disabled={isUploading}
          >
            <Camera className="mr-2 h-4 w-4" />
            {previewUrl ? 'Trocar foto' : 'Adicionar foto'}
          </Button>
        </label>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
