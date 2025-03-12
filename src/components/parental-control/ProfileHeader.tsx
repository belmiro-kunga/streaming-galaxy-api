
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardTitle, CardDescription } from '@/components/ui/card';

interface ProfileHeaderProps {
  name: string;
  avatar: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  profileId: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  avatar,
  enabled,
  onToggleEnabled,
  profileId
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-4 border-2 border-gray-700">
          <AvatarImage src={avatar} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{name}</CardTitle>
          <CardDescription className="text-gray-400">
            Perfil infantil
          </CardDescription>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Label htmlFor={`enable-parental-${profileId}`} className="mr-2">
          Controle parental
        </Label>
        <Switch 
          id={`enable-parental-${profileId}`} 
          checked={enabled}
          onCheckedChange={onToggleEnabled}
        />
      </div>
    </div>
  );
};
