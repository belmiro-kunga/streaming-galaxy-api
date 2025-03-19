
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SearchOverlayProps {
  isOpen: boolean;
  searchQuery: string;
  searchSuggestions: string[];
  onClose: () => void;
  onSearchQueryChange: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onSuggestionClick: (suggestion: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  searchQuery,
  searchSuggestions,
  onClose,
  onSearchQueryChange,
  onSearch,
  onSuggestionClick
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Pesquisar</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white" 
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <form onSubmit={onSearch} className="mb-6">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Buscar títulos, gêneros, pessoas..."
            className="bg-gray-800 w-full p-3 pl-12 rounded-md text-white placeholder:text-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400" />
        </div>
      </form>
      
      {searchSuggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white mb-2">Sugestões</h3>
          <div className="flex flex-col space-y-2">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="text-left p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white flex items-center"
              >
                <Search className="mr-2 h-4 w-4" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
