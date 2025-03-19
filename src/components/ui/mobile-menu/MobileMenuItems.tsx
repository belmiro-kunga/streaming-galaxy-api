
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { MobileMenuItemsProps } from '@/types/ui';

export const MobileMenuItems: React.FC<MobileMenuItemsProps> = ({ menuItems, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  return (
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
  );
};
