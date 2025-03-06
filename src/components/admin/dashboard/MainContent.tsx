
import React from 'react';
import { useAdminDashboard } from '@/contexts/admin/AdminDashboardContext';
import { TabsContent, Tabs } from "@/components/ui/tabs";
import OverviewTab from './overview/OverviewTab';
import UsersTab from './users/UsersTab';
import ContentTab from './ContentTab';
import PaymentsTab from './payments/PaymentsTab';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import SubscriptionPlansManager from '@/components/admin/SubscriptionPlansManager';
import HomeTab from './home/HomeTab';

const MainContent = () => {
  const { 
    activeTab, 
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    userStats,
    contentStats,
    pendingPayments,
    users,
    approvePayment,
    rejectPayment,
    addUser,
    editUser,
    deleteUser,
    manageSubscription
  } = useAdminDashboard();

  return (
    <main className="flex-1 overflow-y-auto bg-gray-950">
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview">
            <OverviewTab 
              userStats={userStats}
              contentStats={contentStats}
              pendingPayments={pendingPayments}
              users={users}
              approvePayment={approvePayment}
              rejectPayment={rejectPayment}
            />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersTab 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredUsers={filteredUsers}
              addUser={addUser}
              editUser={editUser}
              deleteUser={deleteUser}
              manageSubscription={manageSubscription}
            />
          </TabsContent>
          
          <TabsContent value="plans">
            <SubscriptionPlansManager />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentTab />
          </TabsContent>
          
          <TabsContent value="payments">
            <PaymentsTab 
              pendingPayments={pendingPayments}
              approvePayment={approvePayment}
              rejectPayment={rejectPayment}
            />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
          
          <TabsContent value="home">
            <HomeTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default MainContent;
