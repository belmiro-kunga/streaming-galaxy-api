
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PlanLimitsInputsProps {
  screens: number;
  downloads: number;
  profiles: number;
  onScreensChange: (value: number) => void;
  onDownloadsChange: (value: number) => void;
  onProfilesChange: (value: number) => void;
  isLoading?: boolean;
}

const PlanLimitsInputs: React.FC<PlanLimitsInputsProps> = ({
  screens,
  downloads,
  profiles,
  onScreensChange,
  onDownloadsChange,
  onProfilesChange,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="screens">Telas Simultâneas</Label>
        <Input 
          id="screens" 
          type="number"
          min="1"
          max="10"
          value={screens}
          onChange={(e) => onScreensChange(Number(e.target.value) || 1)}
          className="bg-gray-800 border-gray-700 text-white"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="downloads">Limite de Downloads</Label>
        <Input 
          id="downloads" 
          type="number"
          min="0"
          value={downloads}
          onChange={(e) => onDownloadsChange(Number(e.target.value) || 0)}
          className="bg-gray-800 border-gray-700 text-white"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="profiles">Limite de Perfis</Label>
        <Input 
          id="profiles" 
          type="number"
          min="1"
          max="10"
          value={profiles}
          onChange={(e) => onProfilesChange(Number(e.target.value) || 1)}
          className="bg-gray-800 border-gray-700 text-white"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default PlanLimitsInputs;
