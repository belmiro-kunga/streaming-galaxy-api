
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Menu, User, LogOut, Settings, CreditCard, Gauge, Home, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 bg-gradient-to-b from-black/90 to-transparent">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-[#E50914] font-bold text-2xl mr-8">STREAMGALAXY</Link>
        
        {/* Navigation Tabs - Centered for desktop */}
        {!isMobile && (
          <div className="flex-1 flex justify-center">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList className="bg-transparent">
                <TabsTrigger value="all" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Início</TabsTrigger>
                <TabsTrigger value="movies" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Filmes</TabsTrigger>
                <TabsTrigger value="series" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Séries</TabsTrigger>
                <TabsTrigger value="more" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Mais Conteúdos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-white" aria-label="Pesquisar">
            <Search className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-white" aria-label="Notificações">
            <Bell className="w-5 h-5" />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2">
                <Avatar className="w-8 h-8 border-2 border-white/20">
                  <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {!isMobile && <span className="text-white text-sm">Usuário</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
              <DropdownMenuLabel className="flex items-center">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>Usuário</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Pagamento</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <Gauge className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="flex items-center cursor-pointer text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 p-2 border-t border-gray-800 z-50">
          <div className="flex justify-around items-center">
            <Button variant="ghost" className="flex flex-col items-center text-gray-400 hover:text-white">
              <Home className="h-6 w-6 mb-1" />
              <span className="text-xs">Início</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center text-gray-400 hover:text-white">
              <Search className="h-6 w-6 mb-1" />
              <span className="text-xs">Busca</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center text-gray-400 hover:text-white">
              <Download className="h-6 w-6 mb-1" />
              <span className="text-xs">Downloads</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center text-gray-400 hover:text-white">
              <User className="h-6 w-6 mb-1" />
              <span className="text-xs">Perfil</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
