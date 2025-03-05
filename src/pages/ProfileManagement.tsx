
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileManagementComponent from '@/components/ProfileManagement';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const ProfileManagement = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => localStorage.getItem('darkMode') === 'dark' ? 'dark' : 'light'
  );

  // Check for dark mode at component load
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDarkMode = savedMode 
      ? savedMode === 'dark' 
      : prefersDark;
    
    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'light');
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-foreground" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Gerenciamento de Perfis</h1>
          </div>
          
          <ThemeToggle />
        </div>
        
        <ProfileManagementComponent />
      </div>
    </motion.div>
  );
};

export default ProfileManagement;
