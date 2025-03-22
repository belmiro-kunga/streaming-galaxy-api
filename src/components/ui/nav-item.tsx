
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavItem = ({ 
  icon, 
  label, 
  active = false, 
  onClick, 
  className 
}: NavItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
        className
      )}
    >
      <span className="mr-3 flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
};

export default NavItem;
