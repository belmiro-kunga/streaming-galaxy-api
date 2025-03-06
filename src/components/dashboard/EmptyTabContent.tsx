
import React from 'react';
import { Film, TrendingUp, Clock, BookmarkCheck, Settings } from 'lucide-react';

interface EmptyTabContentProps {
  tabName: string;
}

const EmptyTabContent = ({ tabName }: EmptyTabContentProps) => {
  const getIcon = () => {
    switch (tabName) {
      case 'mylist':
        return <Film className="h-8 w-8 text-gray-400" />;
      case 'trending':
        return <TrendingUp className="h-8 w-8 text-gray-400" />;
      case 'history':
        return <Clock className="h-8 w-8 text-gray-400" />;
      case 'favorites':
        return <BookmarkCheck className="h-8 w-8 text-gray-400" />;
      case 'settings':
        return <Settings className="h-8 w-8 text-gray-400" />;
      default:
        return <Film className="h-8 w-8 text-gray-400" />;
    }
  };

  const getTitle = () => {
    switch (tabName) {
      case 'mylist':
        return 'Minha Lista';
      case 'trending':
        return 'Populares';
      case 'history':
        return 'Histórico';
      case 'favorites':
        return 'Favoritos';
      case 'settings':
        return 'Configurações';
      default:
        return tabName.charAt(0).toUpperCase() + tabName.slice(1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h2 className="text-xl font-bold mb-2">
        {getTitle()}
      </h2>
      <p className="text-gray-400 text-center max-w-md">
        Esta funcionalidade será implementada em breve. Estamos trabalhando para trazer a melhor experiência possível.
      </p>
    </div>
  );
};

export default EmptyTabContent;
