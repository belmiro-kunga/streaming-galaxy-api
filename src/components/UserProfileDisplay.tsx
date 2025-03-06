
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export const UserProfileDisplay = () => {
  const { profile, loading } = useUser();
  
  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400">Nenhum perfil de usuário encontrado. Por favor, faça login.</p>
      </div>
    );
  }
  
  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  
  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50">
      <Avatar className="h-12 w-12 border-2 border-primary">
        <AvatarFallback className="bg-primary/20 text-primary">
          {initials || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div>
        <h3 className="font-medium text-lg">{fullName || 'Usuário'}</h3>
        <p className="text-gray-400">{profile.email}</p>
        {profile.country && profile.province && (
          <p className="text-sm text-gray-500 mt-1">
            {profile.province}, {profile.country}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfileDisplay;
