
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '../types';
import { supabase } from '@/lib/supabase';

export const useUserDeletion = (setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const deleteUser = useCallback((user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }, []);
  
  const handleDeleteConfirm = useCallback(async () => {
    if (userToDelete) {
      try {
        // Delete from Supabase if it's not a mock user
        if (!userToDelete.id.startsWith('USR-')) {
          // Real user, delete from Supabase
          const { error } = await supabase.auth.admin.deleteUser(userToDelete.id);
          
          if (error) {
            throw error;
          }
        }
        
        // Remove from local state
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
        
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
  }, [userToDelete, toast, setUsers]);

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    setUserToDelete,
    deleteUser,
    handleDeleteConfirm
  };
};
