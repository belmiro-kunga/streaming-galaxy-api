
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Settings, CreditCard, Gauge, Home, Download, X, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Mock search suggestions - this would be replaced with actual API calls
  const mockSuggestions = [
    'Stranger Things', 'The Crown', 'Breaking Bad', 'Game of Thrones',
    'Black Mirror', 'Dark', 'Money Heist', 'Narcos', 'The Witcher'
  ];
  
  useEffect(() => {
    // Focus the search input when it opens
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  useEffect(() => {
    // Filter suggestions based on search query
    if (searchQuery.trim() === '') {
      setSearchSuggestions([]);
      return;
    }
    
    const filteredSuggestions = mockSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchSuggestions(filteredSuggestions);
  }, [searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Pesquisando",
        description: `Buscando por "${searchQuery}"`,
      });
      // In a real app, you would navigate to search results page
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    toast({
      title: "Pesquisando",
      description: `Buscando por "${suggestion}"`,
    });
    // In a real app, you would navigate to search results page
    // navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 bg-gradient-to-b from-black/90 to-transparent">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-[#E50914] font-bold text-2xl mr-8">CINEPLAY</Link>
        
        {/* Navigation Tabs - Centered for desktop */}
        {!isMobile && (
          <div className="flex-1 flex justify-center">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList className="bg-transparent">
                <TabsTrigger value="all" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent" onClick={() => navigate('/home')}>Início</TabsTrigger>
                <TabsTrigger value="movies" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Filmes</TabsTrigger>
                <TabsTrigger value="series" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Séries</TabsTrigger>
                <TabsTrigger value="kids" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent" onClick={() => navigate('/kids')}>Kids</TabsTrigger>
                <TabsTrigger value="price" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent" onClick={() => navigate('/subscription-plans')}>Preço</TabsTrigger>
                <TabsTrigger value="more" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent">Mais Conteúdos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <button 
            className="p-2 text-white" 
            aria-label="Pesquisar" 
            onClick={() => setIsSearchOpen(true)}
          >
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
              <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard/profiles')}>
                <User className="mr-2 h-4 w-4" />
                <span>Gerenciar Perfis</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => navigate('/user-settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => navigate('/subscription-plans')}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Planos de Assinatura</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                <Gauge className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="flex items-center cursor-pointer text-red-500" onClick={() => navigate('/login')}>
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
            <Link to="/home">
              <Button variant="ghost" className="flex flex-col items-center text-gray-400 hover:text-white">
                <Home className="h-6 w-6 mb-1" />
                <span className="text-xs">Início</span>
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center text-gray-400 hover:text-white"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-6 w-6 mb-1" />
              <span className="text-xs">Busca</span>
            </Button>
            <Link to="/dashboard/downloads">
              <Button variant="ghost" className="flex flex-col items-center text-gray-400 hover:text-white">
                <Download className="h-6 w-6 mb-1" />
                <span className="text-xs">Downloads</span>
              </Button>
            </Link>
            <Link to="/kids">
              <Button variant="ghost" className="flex flex-col items-center text-gray-400 hover:text-white">
                <Baby className="h-6 w-6 mb-1" />
                <span className="text-xs">Kids</span>
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" className="flex flex-col items-center text-gray-400 hover:text-white">
                <User className="h-6 w-6 mb-1" />
                <span className="text-xs">Perfil</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Pesquisar</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white" 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
                setSearchSuggestions([]);
              }}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filmes, séries, gêneros..."
                className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>
          
          {searchSuggestions.length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-4">
                <h3 className="text-sm text-gray-400 mb-2">Sugestões</h3>
                <ul className="space-y-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <li 
                      key={index}
                      className="p-2 hover:bg-gray-700 rounded cursor-pointer flex items-center"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </header>
  );
};
