
import React from 'react';
import { Pencil, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    avatar: string;
    isKids: boolean;
    pin: string | null;
    canEdit: boolean;
    canDelete: boolean;
  };
  onEdit: (profile: any) => void;
  onPin: (profile: any) => void;
  onDelete: (profile: any) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onEdit,
  onPin,
  onDelete
}) => {
  return (
    <Card className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-16 w-16 mr-4 border-2 border-gray-700">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{profile.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.isKids && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                  <Lock className="h-3 w-3 mr-1" />
                  Infantil
                </span>
              )}
              {profile.pin && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                  <Lock className="h-3 w-3 mr-1" />
                  PIN
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {profile.canEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-700 hover:bg-gray-800"
              onClick={() => onEdit(profile)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          
          {!profile.isKids && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-700 hover:bg-gray-800"
              onClick={() => onPin(profile)}
            >
              <Lock className="h-4 w-4 mr-2" />
              {profile.pin ? "Alterar PIN" : "Definir PIN"}
            </Button>
          )}
          
          {profile.canDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-700 hover:bg-red-900/20 text-red-400"
              onClick={() => onDelete(profile)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
