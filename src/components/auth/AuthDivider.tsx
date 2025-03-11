import React from 'react';
import { Separator } from '@/components/ui/separator';

interface AuthDividerProps {
  message?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ 
  message = "Ou continue com seu e-mail" 
}) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full border-t border-gray-200 dark:border-gray-600" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {message}
        </span>
      </div>
    </div>
  );
};
