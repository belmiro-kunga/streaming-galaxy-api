
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileMenuUserSectionProps } from '@/types/ui';

export const MobileMenuUserSection: React.FC<MobileMenuUserSectionProps> = ({ 
  isAuthenticated, 
  profile, 
  onLogout, 
  onClose 
}) => {
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  return (
    <div className="sticky bottom-0 p-4 border-t border-white/10 bg-gradient-to-t from-zinc-900/95 to-transparent backdrop-blur-sm">
      <div className="space-y-3">
        <div className="flex items-center space-x-3 px-2 mb-4">
          <Avatar className="h-9 w-9 border border-white/20">
            <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
            <AvatarFallback>{profile?.first_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-white">{profile?.first_name || 'Usuário'}</p>
            <p className="text-xs text-gray-400">Conta Premium</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10 h-11"
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
        >
          <User className="mr-2 h-5 w-5" />
          Perfil
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10 h-11"
          onClick={async () => {
            await onLogout();
            onClose();
          }}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};
