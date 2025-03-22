
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewTab from './overview/OverviewTab';
import UsersTab from './users/UsersTab';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import ContentManagerTab from './content/ContentManagerTab';
import MediaContentTab from './content/MediaContentTab';
import TVChannelsTab from './content/TVChannelsTab';
import PaymentsTab from './payments/PaymentsTab';
import ImportContentTab from './content/ImportContentTab';
import DialogContainer from './DialogContainer';
import { useAdminDashboard } from '@/contexts/admin';

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
  
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
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
            {activeTab === 'payments' && (
              <PaymentsTab 
                pendingPayments={pendingPayments}
                approvePayment={approvePayment}
                rejectPayment={rejectPayment}
              />
            )}
            {activeTab === 'content-import' && <ImportContentTab />}
          </div>
        </main>
      </div>
      <DialogContainer />
    </div>
  );
};

export default DashboardLayout;
