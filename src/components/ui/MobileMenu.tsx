import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Tv, Film, Globe, CreditCard, 
  PlayCircle, Gamepad2, Newspaper, Clapperboard, 
  BadgePercent, Sparkles, LogIn, User, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Sparkles, label: 'Conteúdo Grátis', href: '/free-content' },
  { icon: Clapperboard, label: 'Anime', href: '/anime' },
  { icon: PlayCircle, label: 'Animação', href: '/animation' },
  { icon: Film, label: 'Dorama', href: '/dorama' },
  { icon: Tv, label: 'Novela', href: '/novela' },
  { icon: Gamepad2, label: 'Desporto', href: '/sports' },
  { icon: Newspaper, label: 'TV', href: '/tv' },
  { icon: BadgePercent, label: 'Preço', href: '/subscription-plans' },
];

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, profile, logout } = useUser();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay com blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 200,
              duration: 0.3
            }}
            className="fixed right-0 top-0 h-[100dvh] w-[85%] max-w-[280px] bg-gradient-to-b from-zinc-900/95 to-black/95 z-50 flex flex-col overflow-hidden"
          >
            {/* Header com gradiente */}
            <div className="sticky top-0 h-16 flex items-center justify-between px-6 bg-gradient-to-b from-zinc-800/50 to-transparent z-10">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full w-9 h-9"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Menu Items com efeito de deslize */}
            <div className="flex-1 py-2 overflow-y-auto overscroll-contain">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: index * 0.03,
                    duration: 0.15
                  }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center px-6 py-3.5 text-gray-300 active:bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={onClose}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium text-base">{item.label}</span>
                  </Link>
                  {item.label === 'Preço' && !isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.15 }}
                    >
                      <div className="mt-2 mb-2 px-6">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 h-11"
                          onClick={() => {
                            navigate('/login');
                            onClose();
                          }}
                        >
                          <LogIn className="h-5 w-5 mr-3" />
                          <span className="font-medium text-base">Entrar</span>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* User Section */}
            <div className="sticky bottom-0 p-4 border-t border-white/10 bg-gradient-to-t from-zinc-900/95 to-transparent backdrop-blur-sm">
              {isAuthenticated && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-2 mb-4">
                    <Avatar className="h-9 w-9 border border-white/20">
                      <AvatarImage src="https://source.unsplash.com/random/100x100?face" />
                      <AvatarFallback>{profile?.first_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">{profile?.first_name || 'Usuário'}</p>
                      <p className="text-xs text-gray-400">Conta Premium</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/10 h-11"
                    onClick={() => {
                      navigate('/profile');
                      onClose();
                    }}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Perfil
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/10 h-11"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 