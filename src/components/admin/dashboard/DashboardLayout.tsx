
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewTab from './overview/OverviewTab';
import UsersTab from './users/UsersTab';
import ReportsTab from './ReportsTab';
import SettingsTab from './settings/SystemSettings';
import ContentManagerTab from './content/ContentManagerTab';
import MediaContentTab from './content/MediaContentTab';
import TVChannelsTab from './content/TVChannelsTab';
import PaymentsTab from './payments/PaymentsTab';
import ImportContentTab from './content/ImportContentTab';
import DialogContainer from './DialogContainer';
import { useAdminDashboard } from '@/contexts/admin';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const DashboardLayout = () => {
  const { 
    activeTab, 
    sidebarOpen, 
    setSidebarOpen, 
    userStats, 
    contentStats, 
    pendingPayments, 
    users, 
    filteredUsers,
    approvePayment, 
    rejectPayment,
    addUser,
    editUser,
    deleteUser,
    manageSubscription
  } = useAdminDashboard();
  
  const [searchQuery, setSearchQuery] = React.useState('');

  // Set body class for better theming
  useEffect(() => {
    document.body.classList.add('admin-dashboard');
    return () => {
      document.body.classList.remove('admin-dashboard');
    };
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <main className="relative flex-1 overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            <div className="absolute top-4 right-4 z-10">
              <ThemeToggle />
            </div>
            
            {activeTab === 'overview' && (
              <OverviewTab 
                userStats={userStats} 
                contentStats={contentStats}
                pendingPayments={pendingPayments}
                users={users}
                approvePayment={approvePayment}
                rejectPayment={rejectPayment}
              />
            )}
            {activeTab === 'users' && (
              <UsersTab 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredUsers={filteredUsers}
                addUser={addUser}
                editUser={editUser}
                deleteUser={deleteUser}
                manageSubscription={manageSubscription}
              />
            )}
            {activeTab === 'reports' && <ReportsTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'content-manager' && <ContentManagerTab />}
            {activeTab === 'media-content' && <MediaContentTab />}
            {activeTab === 'tv-channels' && <TVChannelsTab />}
            {activeTab === 'content-import' && <ImportContentTab />}
            {activeTab === 'payments' && (
              <PaymentsTab 
                pendingPayments={pendingPayments}
                approvePayment={approvePayment}
                rejectPayment={rejectPayment}
              />
            )}
          </div>
        </main>
      </div>
      <DialogContainer />
    </div>
  );
};

export default DashboardLayout;
