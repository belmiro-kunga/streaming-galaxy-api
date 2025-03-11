
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll for transparent/solid header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-colors duration-300 px-4 md:px-8 py-2 flex items-center justify-between",
        scrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="mr-8">
          <svg viewBox="0 0 111 30" className="h-6 md:h-7 w-auto fill-red-600" aria-hidden="true">
            <path d="M105.06 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.7-.24-3.4-.507-5.09-.773l9.09-20.766 9.87.6v1.44L105.06 14.28M90.234 0v27.25c-1.74.02-3.49.048-5.24.084V.083l5.24-.083M61.902.181c1.74 0 3.49.03 5.23.083v26.986c-1.74.053-3.48.098-5.23.147v-12.48l-3.58 8.044c-1.49-.033-2.99-.064-4.49-.098a7369.268 7369.268 0 0 0 3.83-8.816V.766l4.24-.585m-30.967 19.93c4.93 0 5.36-6.42 5.36-11.29C36.295 4.39 36.576 0 31.935 0c-4.65 0-5.27 4.39-5.27 8.63 0 4.69.42 11.48 5.27 11.48m0-26.49c7.65 0 10.59 5.54 10.59 15.42 0 9.61-3.74 14.21-10.59 14.21-6.85 0-10.58-4.6-10.58-14.21 0-10.18 3.52-15.42 10.58-15.42M75.23.084v26.852c-1.74.033-3.493.068-5.25.104V9.654l-2.2 12.812c-1.25.02-2.496.035-3.748.057L61.83 9.653v16.622c-1.22.02-2.44.035-3.66.054V.08c2.05 0 4.1-.057 6.15-.057l2.08 12.214L68.46.026 75.23.084zM20.345 25.097V.076h17.834v6.649c-2.1 0-4.213.016-6.335.04V8.96c1.853.016 3.716.035 5.583.057v6.65c-1.867.02-3.73.042-5.584.066v2.677c2.352.03 4.678.06 6.955.095v6.65c-6.153.11-12.356.235-18.623.376v-.434z"></path>
          </svg>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className={cn("text-sm font-medium hover:text-white transition-colors", isActive("/") ? "text-white" : "text-gray-300")}>
            Início
          </Link>
          <Link to="/series" className={cn("text-sm font-medium hover:text-white transition-colors", isActive("/series") ? "text-white" : "text-gray-300")}>
            Séries
          </Link>
          <Link to="/movies" className={cn("text-sm font-medium hover:text-white transition-colors", isActive("/movies") ? "text-white" : "text-gray-300")}>
            Filmes
          </Link>
          <Link to="/recent" className={cn("text-sm font-medium hover:text-white transition-colors", isActive("/recent") ? "text-white" : "text-gray-300")}>
            Mais recentes
          </Link>
          <Link to="/my-list" className={cn("text-sm font-medium hover:text-white transition-colors", isActive("/my-list") ? "text-white" : "text-gray-300")}>
            Minha lista
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden ml-4 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className={cn("space-y-1", mobileMenuOpen && "transform")}>
            <span className={cn("block w-5 h-0.5 bg-white transition-transform", mobileMenuOpen && "rotate-45 translate-y-1.5")}></span>
            <span className={cn("block w-5 h-0.5 bg-white transition-opacity", mobileMenuOpen && "opacity-0")}></span>
            <span className={cn("block w-5 h-0.5 bg-white transition-transform", mobileMenuOpen && "-rotate-45 -translate-y-1.5")}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={cn(
        "absolute top-full left-0 right-0 bg-black transition-all duration-300 overflow-hidden",
        mobileMenuOpen ? "max-h-64 py-2 border-t border-gray-800" : "max-h-0"
      )}>
        <nav className="flex flex-col space-y-3 px-4">
          <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white">Início</Link>
          <Link to="/series" className="text-sm font-medium text-gray-300 hover:text-white">Séries</Link>
          <Link to="/movies" className="text-sm font-medium text-gray-300 hover:text-white">Filmes</Link>
          <Link to="/recent" className="text-sm font-medium text-gray-300 hover:text-white">Mais recentes</Link>
          <Link to="/my-list" className="text-sm font-medium text-gray-300 hover:text-white">Minha lista</Link>
        </nav>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">
        <button className="text-white">
          <Search className="w-5 h-5" />
        </button>
        <Link to="/kids" className="hidden md:block text-sm font-medium text-white">
          INFANTIL
        </Link>
        <div className="relative">
          <button className="text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              9+
            </span>
          </button>
        </div>
        <div className="flex items-center">
          <img 
            src="public/lovable-uploads/53cb706f-6b66-441a-a038-d42624fd5975.png" 
            alt="User Profile" 
            className="w-8 h-8 rounded" 
          />
          <ChevronDown className="w-4 h-4 text-white ml-1" />
        </div>
      </div>
    </header>
  );
};
