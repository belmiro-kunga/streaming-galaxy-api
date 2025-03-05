
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileManagementComponent from '@/components/ProfileManagement';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const ProfileManagement = () => {
  const navigate = useNavigate();

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
