import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, LogOut, Settings, CreditCard, Gauge, Home, Download, X, Baby, LogIn, Film, Tv, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMobile } from '@/hooks/use-mobile';
import { useDeviceType } from '@/hooks/use-device-type';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { MobileMenu } from './MobileMenu';
import { BottomNav } from './BottomNav';
import { mainMenuItems } from '@/config/menu-items';
import { CollapsibleSidebar } from './CollapsibleSidebar';

export const Header = () => {
  const isMobile = useMobile();
  const deviceType = useDeviceType();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isAuthenticated, profile, logout } = useUser();
  
  const mockSuggestions = [
    'Stranger Things', 'The Crown', 'Breaking Bad', 'Game of Thrones',
    'Black Mirror', 'Dark', 'Money Heist', 'Narcos', 'The Witcher'
  ];
  
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchSuggestions([]);
      return;
    }
    
    const filteredSuggestions = mockSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchSuggestions(filteredSuggestions);
  }, [searchQuery]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Pesquisando",
        description: `Buscando por "${searchQuery}"`,
      });
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    toast({
      title: "Pesquisando",
      description: `Buscando por "${suggestion}"`,
    });
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-2 bg-gradient-to-b from-black/90 to-transparent">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-[#E50914] font-bold text-xl">CINEPLAY</Link>
          
          {!isMobile && (
            <nav className="flex-1 flex justify-center space-x-6">
              {mainMenuItems.map((item) => (
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
          )}
          
          <div className="flex items-center space-x-3">
            <button 
              className="p-1.5 text-white" 
              aria-label="Pesquisar" 
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-4 h-4" />
            </button>
            
            {isAuthenticated && !isMobile && (
              <button className="p-1.5 text-white" aria-label="Notificações">
                <Bell className="w-4 h-4" />
              </button>
            )}
            
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            {!isMobile && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6 border border-white/20">
                          <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
                          <AvatarFallback>{profile?.first_name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-gray-900 border-gray-700">
                      <DropdownMenuLabel className="flex items-center text-sm">
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
                          <AvatarFallback>{profile?.first_name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <span>{profile?.first_name || 'Usuário'}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => navigate('/subscription-plans')}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Planos</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-white/10" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={() => navigate('/login')}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>
      
      {!isMobile && <CollapsibleSidebar />}
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {isMobile && <BottomNav />}
      
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
              }}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    onClick={() => handleSuggestionClick(suggestion)}
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
      )}
    </>
  );
};
