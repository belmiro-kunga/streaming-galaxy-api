
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '../types';

export const useUserSubscription = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const manageSubscription = useCallback((user: User) => {
    setCurrentUser(user);
    setSelectedSubscription(user.subscription || "");
    setIsSubscriptionDialogOpen(true);
  }, []);
  
  const handleSaveSubscription = useCallback(() => {
    if (!currentUser) return;
    
    setUsers(prevUsers => prevUsers.map(u => 
      u.id === currentUser.id ? { ...u, subscription: selectedSubscription } : u
    ));
    toast({
      title: "Assinatura atualizada",
      description: `A assinatura de ${currentUser.name} foi atualizada para ${selectedSubscription}.`
    });
    setIsSubscriptionDialogOpen(false);
  }, [currentUser, selectedSubscription, toast, setUsers]);

  return {
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    selectedSubscription,
    setSelectedSubscription,
    currentUser,
    setCurrentUser,
    manageSubscription,
    handleSaveSubscription
  };
};
