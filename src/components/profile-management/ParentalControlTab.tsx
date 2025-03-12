
import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParentalControlSettings } from '../ParentalControlSettings';

interface ParentalControlTabProps {
  profiles: Array<any>;
  onUpdateParentalControl: (profileId: string, settings: any) => void;
  onSwitchToProfilesTab: () => void;
  onOpenAddDialog: () => void;
}

export const ParentalControlTab: React.FC<ParentalControlTabProps> = ({
  profiles,
  onUpdateParentalControl,
  onSwitchToProfilesTab,
  onOpenAddDialog
}) => {
  const kidsProfiles = profiles.filter(profile => profile.isKids);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Configurações de Controle Parental</h2>
      
      {kidsProfiles.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-semibold mb-2">Nenhum perfil infantil encontrado</h3>
          <p className="text-gray-400 mb-4">
            Adicione um perfil infantil para configurar o controle parental.
          </p>
          <Button onClick={() => {
            onSwitchToProfilesTab();
            onOpenAddDialog();
          }}>
            Adicionar perfil infantil
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {kidsProfiles.map(profile => (
            <ParentalControlSettings 
              key={profile.id}
              profile={profile}
              onUpdate={(settings) => onUpdateParentalControl(profile.id, settings)}
            />
          ))}
        </div>
      )}
    </>
  );
};
