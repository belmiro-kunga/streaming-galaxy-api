import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Tv, Download, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Início', href: '/home' },
  { icon: Film, label: 'Filmes', href: '/movies' },
  { icon: Tv, label: 'Séries', href: '/series' },
  { icon: Download, label: 'Downloads', href: '/downloads' },
  { icon: Baby, label: 'Kids', href: '/kids' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 to-black/90 backdrop-blur-lg border-t border-white/5">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute inset-0 bg-red-500/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={cn(
                'flex flex-col items-center justify-center space-y-1 relative z-10',
                isActive ? 'text-red-500' : 'text-gray-400'
              )}>
                <item.icon className={cn(
                  'w-5 h-5 transition-all',
                  isActive ? 'scale-105' : 'scale-100'
                )} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}; 