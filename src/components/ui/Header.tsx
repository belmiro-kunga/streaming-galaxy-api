
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogIn, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import { useDeviceType } from '@/hooks/use-device-type';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { MobileMenu } from './MobileMenu';
import { BottomNav } from './BottomNav';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { NavigationLinks } from './NavigationLinks';
import { ProfileDropdown } from './ProfileDropdown';
import { SearchOverlay } from './SearchOverlay';
import { mainMenuItems } from '@/config/menu-items';

export const Header = () => {
  const isMobile = useMobile();
  const deviceType = useDeviceType();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const { isAuthenticated, profile, logout } = useUser();
  
  const mockSuggestions = [
    'Stranger Things', 'The Crown', 'Breaking Bad', 'Game of Thrones',
    'Black Mirror', 'Dark', 'Money Heist', 'Narcos', 'The Witcher'
  ];
  
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
            <NavigationLinks items={mainMenuItems} />
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
                  <ProfileDropdown profile={profile} onLogout={handleLogout} />
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
      
      <SearchOverlay
        isOpen={isSearchOpen}
        searchQuery={searchQuery}
        searchSuggestions={searchSuggestions}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        onSuggestionClick={handleSuggestionClick}
      />
    </>
  );
};
