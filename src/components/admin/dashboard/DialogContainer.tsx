
import React from 'react';
import { useAdminDashboard } from '@/contexts/admin';
import UserDialog from './dialogs/UserDialog';
import SubscriptionDialog from './dialogs/SubscriptionDialog';
import DeleteConfirmationDialog from './dialogs/DeleteConfirmationDialog';

const DialogContainer = () => {
  const {
    // User dialog state and actions
    isUserDialogOpen,
    setIsUserDialogOpen,
    dialogMode,
    currentUser,
    setCurrentUser,
    handleSaveUser,
    
    // Subscription dialog state and actions
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    selectedSubscription,
    setSelectedSubscription,
    subscriptionPlans,
    handleSaveSubscription,
    
    // Delete dialog state and actions
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
        currentUser={currentUser}
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
