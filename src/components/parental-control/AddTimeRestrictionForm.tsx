
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TimeRestriction {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface AddTimeRestrictionFormProps {
  newTimeRestriction: TimeRestriction;
  onTimeRestrictionChange: (field: keyof TimeRestriction, value: string) => void;
  onAddTimeRestriction: () => void;
  dayOfWeekOptions: Array<{ value: string; label: string }>;
}

export const AddTimeRestrictionForm: React.FC<AddTimeRestrictionFormProps> = ({
  newTimeRestriction,
  onTimeRestrictionChange,
  onAddTimeRestriction,
  dayOfWeekOptions
}) => {
  return (
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
              onValueChange={(value) => onTimeRestrictionChange('dayOfWeek', value)}
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
                onValueChange={(value) => onTimeRestrictionChange('startTime', value)}
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
                onValueChange={(value) => onTimeRestrictionChange('endTime', value)}
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
          
          <Button className="w-full" onClick={onAddTimeRestriction}>
            Adicionar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
