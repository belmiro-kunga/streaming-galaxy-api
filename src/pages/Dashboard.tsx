
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTVMode } from '@/hooks/use-tv-mode';
import { signOut } from '@/lib/supabase/auth';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHome from '@/components/dashboard/DashboardHome';
import DashboardDownloads from '@/components/dashboard/DashboardDownloads';
import ProfileManagement from '@/components/ProfileManagement';
import DashboardSubscription from '@/components/dashboard/DashboardSubscription';
import EmptyTabContent from '@/components/dashboard/EmptyTabContent';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isTVMode } = useTVMode();
  
  // Determine active tab based on URL path
  const isDownloadsPath = location.pathname === '/dashboard/downloads';
  const isProfilesPath = location.pathname === '/dashboard/profiles';
  const [activeTab, setActiveTab] = useState<string>(
    isDownloadsPath ? 'downloads' : isProfilesPath ? 'profiles' : 'home'
  );

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    toast({
      title: `${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
      description: `Você está na seção ${tab}.`
    });
    
    if (tab === 'home') {
      navigate('/home');
    } else if (tab === 'settings') {
      navigate('/user-settings');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        <DashboardSidebar 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          isTVMode={isTVMode}
        />

        <main className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && <DashboardHome />}
            
            {(activeTab === 'downloads' || isDownloadsPath) && <DashboardDownloads />}
            
            {(activeTab === 'profiles' || isProfilesPath) && <ProfileManagement />}
            
            {activeTab === 'subscription' && <DashboardSubscription />}

            {(activeTab === 'mylist' || activeTab === 'trending' || 
              activeTab === 'history' || activeTab === 'favorites' || 
              activeTab === 'settings') && (
              <EmptyTabContent tabName={activeTab} />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
