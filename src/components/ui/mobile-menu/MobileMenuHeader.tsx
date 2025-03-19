
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileMenuHeaderProps } from '@/types/ui';

export const MobileMenuHeader: React.FC<MobileMenuHeaderProps> = ({ onClose }) => {
  return (
    <div className="sticky top-0 h-16 flex items-center justify-between px-6 bg-gradient-to-b from-zinc-800/50 to-transparent z-10">
      <h2 className="text-lg font-semibold text-white">Menu</h2>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10 rounded-full w-9 h-9"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
