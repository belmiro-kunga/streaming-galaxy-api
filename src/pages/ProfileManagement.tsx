
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileManagementComponent from '@/components/ProfileManagement';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileManagement = () => {
  const navigate = useNavigate();

  // Check for dark mode at component load
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDarkMode = savedMode 
      ? savedMode === 'dark' 
      : prefersDark;
    
    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black dark:from-gray-900 dark:to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 text-white" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Gerenciamento de Perfis</h1>
        </div>
        
        <ProfileManagementComponent />
      </div>
    </motion.div>
  );
};

export default ProfileManagement;
