
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { mobileMenuItems } from '@/config/mobile-menu-items';
import { MobileMenuHeader } from './mobile-menu/MobileMenuHeader';
import { MobileMenuItems } from './mobile-menu/MobileMenuItems';
import { MobileMenuUserSection } from './mobile-menu/MobileMenuUserSection';
import { MobileMenuProps } from '@/types/ui';

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
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
          {/* Overlay with blur */}
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
            <MobileMenuHeader onClose={onClose} />
            <MobileMenuItems menuItems={mobileMenuItems} onClose={onClose} />
            <MobileMenuUserSection 
              isAuthenticated={isAuthenticated} 
              profile={profile} 
              onLogout={handleLogout} 
              onClose={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
