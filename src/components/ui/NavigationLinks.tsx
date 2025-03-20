
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NavigationLinksProps } from '@/types/ui';
import { cn } from '@/lib/utils';

export const NavigationLinks: React.FC<NavigationLinksProps> = ({ items }) => {
  const location = useLocation();
  
  return (
    <nav className="flex-1 flex justify-center space-x-6">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center space-x-2 transition-colors",
              isActive ? "text-white" : "text-gray-300 hover:text-white"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
