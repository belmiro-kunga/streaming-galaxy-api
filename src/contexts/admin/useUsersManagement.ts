
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from './types';
import { mockUsers } from './mockData';

export const useUsersManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");

  // Computed users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // User management functions
  const addUser = useCallback(() => {
    setDialogMode("add");
    setCurrentUser({ 
      id: "",
      name: "", 
      email: "", 
      first_name: "", 
      last_name: "", 
      phone: "", 
      country: "Angola", 
      province: "", 
      created_at: "",
      status: "Ativo", 
      subscription: null 
    });
    setIsUserDialogOpen(true);
  }, []);
  
  const editUser = useCallback((user: User) => {
    setDialogMode("edit");
    setCurrentUser({ ...user });
    setIsUserDialogOpen(true);
  }, []);
  
  const deleteUser = useCallback((user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }, []);
  
  const handleDeleteConfirm = useCallback(() => {
    if (userToDelete) {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      toast({
        title: "Usuário excluído",
        description: `O usuário ${userToDelete.name} foi excluído com sucesso.`
      });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }, [userToDelete, toast]);
  
  const manageSubscription = useCallback((user: User) => {
    setCurrentUser(user);
    setSelectedSubscription(user.subscription || "");
    setIsSubscriptionDialogOpen(true);
  }, []);
  
  const handleSaveUser = useCallback(() => {
    if (!currentUser) return;
    
    if (dialogMode === "add") {
      const newUser = {
        ...currentUser,
        id: `USR-${users.length + 1}`.padStart(7, '0'),
        name: `${currentUser.first_name} ${currentUser.last_name}`,
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
      toast({
        title: "Usuário adicionado",
        description: `${newUser.name} foi adicionado com sucesso.`
      });
    } else {
      const updatedUser = {
        ...currentUser,
        name: `${currentUser.first_name} ${currentUser.last_name}`
      };
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      toast({
        title: "Usuário atualizado",
        description: `As informações de ${updatedUser.name} foram atualizadas.`
      });
    }
    setIsUserDialogOpen(false);
  }, [currentUser, dialogMode, users.length, toast]);
  
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
  }, [currentUser, selectedSubscription, toast]);

  return {
    // State
    users,
    setUsers,
    currentUser,
    setCurrentUser,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    isUserDialogOpen,
    setIsUserDialogOpen,
    dialogMode,
    setDialogMode,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    selectedSubscription,
    setSelectedSubscription,
    
    // Actions
    addUser,
    editUser,
    deleteUser,
    handleDeleteConfirm,
    manageSubscription,
    handleSaveUser,
    handleSaveSubscription
  };
};
