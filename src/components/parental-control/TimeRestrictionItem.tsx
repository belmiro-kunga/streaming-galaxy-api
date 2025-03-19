
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeRestrictionItemProps } from '@/types/ui';

export const TimeRestrictionItem: React.FC<TimeRestrictionItemProps> = ({
  dayOfWeekLabel,
  startTime,
  endTime,
  onDelete
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <div>
        <p className="font-medium">{dayOfWeekLabel}</p>
        <p className="text-sm text-gray-400">
          {startTime} até {endTime}
        </p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onDelete}
        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
