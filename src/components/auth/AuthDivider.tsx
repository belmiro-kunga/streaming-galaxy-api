
import React from 'react';
import { Separator } from '@/components/ui/separator';

export const AuthDivider: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full dark:bg-gray-600" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card dark:bg-gray-800 px-2 text-muted-foreground dark:text-gray-400">
          Ou continue com seu e-mail
        </span>
      </div>
    </div>
  );
};
