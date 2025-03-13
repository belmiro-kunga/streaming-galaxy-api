
import React from 'react';
import { useAdminDashboard } from '@/contexts/admin';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import DialogContainer from './DialogContainer';

const DashboardLayout = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleLogout
  } = useAdminDashboard();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top header */}
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        setActiveTab={setActiveTab}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          handleLogout={handleLogout} 
        />
        
        {/* Mobile sidebar overlay */}
        {!sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main content */}
        <MainContent />
      </div>
      
      {/* Dialogs */}
      <DialogContainer />
    </div>
  );
};

export default DashboardLayout;
