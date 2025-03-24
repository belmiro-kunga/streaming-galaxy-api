
import React from 'react';
import { Bell, Menu, Search, Home, Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen, searchQuery, setSearchQuery }: HeaderProps) => {
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Pesquisando",
        description: `Buscando por "${searchQuery}"`,
      });
    }
  };

  return (
    <header className="z-10 py-4 px-6 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link 
            to="/admin-dashboard/overview" 
            className="flex items-center space-x-3 ml-2 lg:ml-0"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
              CinePlay Admin
            </span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-md mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input 
              placeholder="Buscar..." 
              className="pl-10 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 w-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex items-center space-x-3 ml-4">
          <a 
            href="/home" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Home className="h-4 w-4" />
          </a>
          
          <button className="flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-1 ring-white dark:ring-gray-900"></span>
          </button>
          
          <div className="flex items-center space-x-2 border-l pl-3 ml-1 border-gray-200 dark:border-gray-700">
            <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                A
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-medium dark:text-gray-200">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
