
import React from 'react';
import { Clock, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tooltip } from '@/components/ui/tooltip';
import { TimeRestrictionItem } from './TimeRestrictionItem';
import { AddTimeRestrictionForm } from './AddTimeRestrictionForm';
import { TimeRestrictionsProps } from '@/types/ui';

export const TimeRestrictions: React.FC<TimeRestrictionsProps> = ({
  timeRestrictions,
  newTimeRestriction,
  onTimeRestrictionChange,
  onAddTimeRestriction,
  onRemoveTimeRestriction,
  dayOfWeekOptions,
  getDayOfWeekLabel
}) => {
  return (
    <div className="space-y-4">
      <Label className="font-medium flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        Restrições de horário
        <Tooltip
          content="Define horários em que o perfil pode assistir a conteúdos"
          delayDuration={300}
        >
          <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
        </Tooltip>
      </Label>

      {timeRestrictions.length > 0 ? (
        <div className="space-y-2">
          {timeRestrictions.map((restriction, index) => (
            <TimeRestrictionItem
              key={index}
              dayOfWeekLabel={getDayOfWeekLabel(restriction.dayOfWeek)}
              startTime={restriction.startTime}
              endTime={restriction.endTime}
              onDelete={() => onRemoveTimeRestriction(index)}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-800/30 rounded-lg text-center text-gray-400">
          Nenhuma restrição de horário definida
        </div>
      )}

      <AddTimeRestrictionForm
        newTimeRestriction={newTimeRestriction}
        onTimeRestrictionChange={onTimeRestrictionChange}
        onAddTimeRestriction={onAddTimeRestriction}
        dayOfWeekOptions={dayOfWeekOptions}
      />
    </div>
  );
};
