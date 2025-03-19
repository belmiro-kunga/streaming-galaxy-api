
import React from 'react';
import { Shield, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tooltip } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RatingRestrictionProps } from '@/types/ui';

export const RatingRestriction: React.FC<RatingRestrictionProps> = ({
  maxRating,
  onMaxRatingChange,
  ratingOptions
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-medium flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Classificação etária máxima
          <Tooltip 
            content="Restringe o acesso a conteúdos com classificação superior a selecionada"
            delayDuration={300}
          >
            <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
          </Tooltip>
        </Label>
        <Select value={maxRating} onValueChange={onMaxRatingChange}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
            <SelectValue placeholder="Selecione a classificação" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {ratingOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
