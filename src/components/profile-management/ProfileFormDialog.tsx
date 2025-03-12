
import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileFormDialogProps {
  title: string;
  description: string;
  formData: { name: string; isKids: boolean };
  imagePreview: string | null;
  currentAvatar?: string;
  onFormDataChange: (data: { name: string; isKids: boolean }) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileFormDialog: React.FC<ProfileFormDialogProps> = ({
  title,
  description,
  formData,
  imagePreview,
  currentAvatar = '',
  onFormDataChange,
  onImageSelect,
  onSave,
  onCancel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <DialogContent className="bg-gray-900 text-white border-gray-800">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className="text-gray-400">
          {description}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-2 border-gray-700 group-hover:border-primary">
              <AvatarImage src={imagePreview || currentAvatar || "https://source.unsplash.com/random/100x100?face=1"} />
              <AvatarFallback>
                <Camera className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              onClick={triggerFileInput}
            >
              <Upload className="h-6 w-6 text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={onImageSelect}
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="profile-name">Nome</Label>
          <Input 
            id="profile-name" 
            value={formData.name} 
            onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
            className="bg-gray-800 border-gray-700"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="profile-kids-mode" 
            checked={formData.isKids}
            onCheckedChange={(checked) => onFormDataChange({ ...formData, isKids: checked })}
          />
          <Label htmlFor="profile-kids-mode">Perfil infantil</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="border-gray-700 hover:bg-gray-800">
          Cancelar
        </Button>
        <Button onClick={onSave}>Salvar</Button>
      </DialogFooter>
    </DialogContent>
  );
};
