
import { useUsersList } from './users/useUsersList';
import { useUserDialog } from './users/useUserDialog';
import { useUserDeletion } from './users/useUserDeletion';
import { useUserSubscription } from './users/useUserSubscription';

export const useUsersManagement = () => {
  // Initialize user list management
  const usersList = useUsersList();
  const { setUsers } = usersList;
  
  // Initialize user dialog management
  const userDialog = useUserDialog(setUsers);
  
  // Initialize user deletion management
  const userDeletion = useUserDeletion(setUsers);
  
  // Initialize subscription management
  const userSubscription = useUserSubscription(setUsers);
  
  return {
    // User list and search
    ...usersList,
    
    // User dialog (add/edit)
    ...userDialog,
    
    // User deletion
    ...userDeletion,
    
    // Subscription management
    ...userSubscription
  };
};
