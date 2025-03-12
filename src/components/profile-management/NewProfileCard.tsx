
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NewProfileCardProps {
  onClick: () => void;
  remainingProfiles: number;
}

export const NewProfileCard: React.FC<NewProfileCardProps> = ({ onClick, remainingProfiles }) => {
  return (
    <Card className="bg-gray-900/30 border-gray-800 border-dashed hover:border-gray-700 transition-colors">
      <CardContent className="p-6 flex flex-col items-center justify-center h-full cursor-pointer" onClick={onClick}>
        <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Plus className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-400 text-center">Adicionar perfil</p>
        <p className="text-gray-500 text-xs text-center mt-1">
          {remainingProfiles} perfil(is) restante(s)
        </p>
      </CardContent>
    </Card>
  );
};
