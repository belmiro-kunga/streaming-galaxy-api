
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from './types';
import { mockUsers } from './mockData';
import { supabase } from '@/lib/supabase';

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
  
  const handleDeleteConfirm = useCallback(async () => {
    if (userToDelete) {
      try {
        // Delete from Supabase if it's not a mock user
        if (userToDelete.id.startsWith('USR-')) {
          // Mock user, just remove from local state
          setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
        } else {
          // Real user, delete from Supabase
          const { error } = await supabase.auth.admin.deleteUser(userToDelete.id);
          
          if (error) {
            throw error;
          }
          
          // Remove from local state as well
          setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
        }
        
        toast({
          title: "Usuário excluído",
          description: `O usuário ${userToDelete.name} foi excluído com sucesso.`
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erro ao excluir usuário",
          description: `Não foi possível excluir o usuário ${userToDelete.name}.`,
          variant: "destructive"
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  }, [userToDelete, toast]);
  
  const manageSubscription = useCallback((user: User) => {
    setCurrentUser(user);
    setSelectedSubscription(user.subscription || "");
    setIsSubscriptionDialogOpen(true);
  }, []);
  
  const handleSaveUser = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      if (dialogMode === "add") {
        // Create user logic
        const { data, error } = await supabase.auth.signUp({
          email: currentUser.email,
          password: '123456', // Default password
          options: {
            data: {
              first_name: currentUser.first_name,
              last_name: currentUser.last_name,
              phone: currentUser.phone,
              country: currentUser.country,
              province: currentUser.province
            }
          }
        });
        
        if (error) throw error;
        
        const newUser = {
          ...currentUser,
          id: data.user?.id || `USR-${Math.random().toString(36).substring(2, 10)}`,
          name: `${currentUser.first_name} ${currentUser.last_name}`,
          created_at: new Date().toISOString().split('T')[0]
        };
        
        setUsers(prevUsers => [...prevUsers, newUser]);
        toast({
          title: "Usuário adicionado",
          description: `${newUser.name} foi adicionado com sucesso.`
        });
      } else {
        // Update user logic
        const { error } = await supabase.auth.updateUser({
          data: {
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
            phone: currentUser.phone,
            country: currentUser.country,
            province: currentUser.province
          }
        });
        
        if (error) throw error;
        
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
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({
        title: "Erro ao salvar usuário",
        description: error.message || "Não foi possível salvar o usuário.",
        variant: "destructive"
      });
    } finally {
      setIsUserDialogOpen(false);
    }
  }, [currentUser, dialogMode, toast]);
  
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
