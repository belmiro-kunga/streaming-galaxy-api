
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProfileHeader } from './parental-control/ProfileHeader';
import { RatingRestriction } from './parental-control/RatingRestriction';
import { TimeRestrictions } from './parental-control/TimeRestrictions';

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

  const handleTimeRestrictionChange = (field: keyof TimeRestriction, value: string) => {
    setNewTimeRestriction({
      ...newTimeRestriction,
      [field]: value
    });
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
        <ProfileHeader 
          name={profile.name}
          avatar={profile.avatar}
          enabled={settings.enabled}
          onToggleEnabled={handleToggleEnabled}
          profileId={profile.id}
        />
      </CardHeader>
      
      <CardContent className="pt-4 space-y-6">
        {/* Rating Restriction */}
        <RatingRestriction 
          maxRating={settings.maxRating}
          onMaxRatingChange={handleMaxRatingChange}
          ratingOptions={ratingOptions}
        />

        {/* Time Restrictions */}
        <TimeRestrictions 
          timeRestrictions={settings.timeRestrictions}
          newTimeRestriction={newTimeRestriction}
          onTimeRestrictionChange={handleTimeRestrictionChange}
          onAddTimeRestriction={addTimeRestriction}
          onRemoveTimeRestriction={removeTimeRestriction}
          dayOfWeekOptions={dayOfWeekOptions}
          getDayOfWeekLabel={getDayOfWeekLabel}
        />
      </CardContent>
    </Card>
  );
};
