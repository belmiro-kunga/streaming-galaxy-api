
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ProfileCard } from './ProfileCard';
import { NewProfileCard } from './NewProfileCard';

interface ProfilesTabProps {
  profiles: Array<any>;
  maxProfiles: number;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  onEditProfile: (profile: any) => void;
  onSetPin: (profile: any) => void;
  onDeleteProfile: (profile: any) => void;
}

export const ProfilesTab: React.FC<ProfilesTabProps> = ({
  profiles,
  maxProfiles,
  isAddDialogOpen,
  setIsAddDialogOpen,
  onEditProfile,
  onSetPin,
  onDeleteProfile
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Gerenciar Perfis</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Perfil
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onEdit={onEditProfile}
            onPin={onSetPin}
            onDelete={onDeleteProfile}
          />
        ))}
        
        {profiles.length < maxProfiles && (
          <NewProfileCard 
            onClick={() => setIsAddDialogOpen(true)}
            remainingProfiles={maxProfiles - profiles.length}
          />
        )}
      </div>
    </>
  );
};
