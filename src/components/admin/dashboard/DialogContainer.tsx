
import React from 'react';
import { useAdminDashboard } from '@/contexts/AdminDashboardContext';
import UserDialog from './dialogs/UserDialog';
import SubscriptionDialog from './dialogs/SubscriptionDialog';
import DeleteConfirmationDialog from './dialogs/DeleteConfirmationDialog';

const DialogContainer = () => {
  const {
    isUserDialogOpen,
    setIsUserDialogOpen,
    dialogMode,
    currentUser,
    setCurrentUser,
    handleSaveUser,
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    currentUser: subscriptionUser,
    selectedSubscription,
    setSelectedSubscription,
    subscriptionPlans,
    handleSaveSubscription,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    handleDeleteConfirm
  } = useAdminDashboard();

  return (
    <>
      <UserDialog 
        isOpen={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        dialogMode={dialogMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        handleSave={handleSaveUser}
      />
      
      <SubscriptionDialog 
        isOpen={isSubscriptionDialogOpen}
        onOpenChange={setIsSubscriptionDialogOpen}
        currentUser={subscriptionUser}
        selectedSubscription={selectedSubscription}
        setSelectedSubscription={setSelectedSubscription}
        subscriptionPlans={subscriptionPlans}
        handleSave={handleSaveSubscription}
      />
      
      <DeleteConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userToDelete={userToDelete}
        handleConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default DialogContainer;
