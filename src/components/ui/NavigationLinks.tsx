
import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from '@/config/menu-items';

interface NavigationLinksProps {
  items: MenuItem[];
}

export const NavigationLinks: React.FC<NavigationLinksProps> = ({ items }) => {
  return (
    <nav className="flex-1 flex justify-center space-x-6">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
