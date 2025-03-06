
import React from 'react';
import { Bell, Menu, Search, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveTab?: (tab: string) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen, searchQuery, setSearchQuery, setActiveTab }: HeaderProps) => {
  return (
    <header className="border-b border-gray-800 bg-gray-900 py-3 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-full hover:bg-gray-800">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-primary">CinePlay Admin</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar..." 
            className="w-64 pl-10 bg-gray-800 border-gray-700 text-white h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-300 hover:text-primary hover:bg-gray-800"
          onClick={() => setActiveTab && setActiveTab("content")}
          title="Acessar Conteúdos"
        >
          <BookOpen className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            A
          </div>
          <span className="hidden md:inline font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
