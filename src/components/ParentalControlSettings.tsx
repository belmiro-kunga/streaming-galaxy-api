
import React, { useState } from 'react';
import { Trash2, Plus, Clock, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimeRestriction {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface ParentalControlProps {
  profile: {
    id: string;
    name: string;
    avatar: string;
    parentalControl: {
      enabled: boolean;
      maxRating: string;
      timeRestrictions: TimeRestriction[];
    };
  };
  onUpdate: (settings: any) => void;
}

export const ParentalControlSettings: React.FC<ParentalControlProps> = ({ profile, onUpdate }) => {
  const [settings, setSettings] = useState(profile.parentalControl);
  const [newTimeRestriction, setNewTimeRestriction] = useState<TimeRestriction>({
    dayOfWeek: 'weekdays',
    startTime: '19:00',
    endTime: '22:00'
  });

  const handleToggleEnabled = (enabled: boolean) => {
    const updatedSettings = { ...settings, enabled };
    setSettings(updatedSettings);
    onUpdate(updatedSettings);
  };

  const handleMaxRatingChange = (maxRating: string) => {
    const updatedSettings = { ...settings, maxRating };
    setSettings(updatedSettings);
    onUpdate(updatedSettings);
  };

  const addTimeRestriction = () => {
    const updatedSettings = {
      ...settings,
      timeRestrictions: [...settings.timeRestrictions, newTimeRestriction]
    };
    setSettings(updatedSettings);
    onUpdate(updatedSettings);
    
    // Reset the form
    setNewTimeRestriction({
      dayOfWeek: 'weekdays',
      startTime: '19:00',
      endTime: '22:00'
    });
  };

  const removeTimeRestriction = (index: number) => {
    const updatedRestrictions = [...settings.timeRestrictions];
    updatedRestrictions.splice(index, 1);
    
    const updatedSettings = {
      ...settings,
      timeRestrictions: updatedRestrictions
    };
    
    setSettings(updatedSettings);
    onUpdate(updatedSettings);
  };

  const dayOfWeekOptions = [
    { value: 'weekdays', label: 'Dias de semana (Seg-Sex)' },
    { value: 'weekends', label: 'Fins de semana (Sáb-Dom)' },
    { value: 'everyday', label: 'Todos os dias' },
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  const ratingOptions = [
    { value: 'L', label: 'Livre' },
    { value: '10', label: '10 anos' },
    { value: '12', label: '12 anos' },
    { value: '14', label: '14 anos' },
    { value: '16', label: '16 anos' },
    { value: '18', label: '18 anos' }
  ];

  const getDayOfWeekLabel = (value: string) => {
    const option = dayOfWeekOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-4 border-2 border-gray-700">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription className="text-gray-400">
                Perfil infantil
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor={`enable-parental-${profile.id}`} className="mr-2">
              Controle parental
            </Label>
            <Switch 
              id={`enable-parental-${profile.id}`} 
              checked={settings.enabled}
              onCheckedChange={handleToggleEnabled}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-6">
        {/* Rating Restriction */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Classificação etária máxima
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white border-gray-700">
                    <p>Restringe o acesso a conteúdos com classificação superior a selecionada</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select value={settings.maxRating} onValueChange={handleMaxRatingChange}>
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

        {/* Time Restrictions */}
        <div className="space-y-4">
          <Label className="font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Restrições de horário
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white border-gray-700">
                  <p>Define horários em que o perfil pode assistir a conteúdos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>

          {settings.timeRestrictions.length > 0 ? (
            <div className="space-y-2">
              {settings.timeRestrictions.map((restriction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium">{getDayOfWeekLabel(restriction.dayOfWeek)}</p>
                    <p className="text-sm text-gray-400">
                      {restriction.startTime} até {restriction.endTime}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeTimeRestriction(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-800/30 rounded-lg text-center text-gray-400">
              Nenhuma restrição de horário definida
            </div>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar restrição de horário
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 bg-gray-900 border-gray-800 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Nova restrição de horário</h4>
                
                <div className="space-y-2">
                  <Label>Dias da semana</Label>
                  <Select 
                    value={newTimeRestriction.dayOfWeek} 
                    onValueChange={(value) => setNewTimeRestriction({...newTimeRestriction, dayOfWeek: value})}
                  >
                    <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Selecione os dias" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {dayOfWeekOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Horário inicial</Label>
                    <Select 
                      value={newTimeRestriction.startTime} 
                      onValueChange={(value) => setNewTimeRestriction({...newTimeRestriction, startTime: value})}
                    >
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Início" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {Array.from({ length: 24 }).map((_, hour) => (
                          <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                            {`${hour.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Horário final</Label>
                    <Select 
                      value={newTimeRestriction.endTime} 
                      onValueChange={(value) => setNewTimeRestriction({...newTimeRestriction, endTime: value})}
                    >
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Fim" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {Array.from({ length: 24 }).map((_, hour) => (
                          <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                            {`${hour.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button className="w-full" onClick={addTimeRestriction}>
                  Adicionar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};
