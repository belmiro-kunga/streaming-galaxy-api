
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProfileDropdownProps } from '@/types/ui';

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ profile, onLogout }) => {
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2">
          <Avatar className="w-6 h-6 border border-white/20">
            <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
            <AvatarFallback>{profile?.first_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
        <DropdownMenuLabel className="flex items-center text-sm">
          <Avatar className="w-6 h-6 mr-2">
            <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
            <AvatarFallback>{profile?.first_name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span>{profile?.first_name || 'Usuário'}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => navigate('/subscription-plans')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Planos</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-white/10" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
