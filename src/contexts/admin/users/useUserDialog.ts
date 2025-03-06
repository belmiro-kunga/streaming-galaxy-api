
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '../types';
import { supabase } from '@/lib/supabase';

export const useUserDialog = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
  }, [currentUser, dialogMode, toast, setUsers]);

  return {
    isUserDialogOpen,
    setIsUserDialogOpen,
    dialogMode,
    setDialogMode,
    currentUser,
    setCurrentUser,
    addUser,
    editUser,
    handleSaveUser
  };
};
