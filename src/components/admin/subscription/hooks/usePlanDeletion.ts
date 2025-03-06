
import { useState } from 'react';
import { SubscriptionPlan } from '@/types/api';
import { useToast } from "@/hooks/use-toast";
import { directSupabaseApi } from '@/lib/supabase';

export const usePlanDeletion = (fetchPlans: () => Promise<void>) => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const deletePlan = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!planToDelete) {
      console.error("SubscriptionPlansManager: Cannot delete plan - planToDelete is null");
      toast({
        title: 'Erro',
        description: 'Plano para exclusão não encontrado',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log(`SubscriptionPlansManager: Deleting plan ${planToDelete.id}`);
      const response = await directSupabaseApi.deletePlan(planToDelete.id);
      setIsLoading(false);
      
      if (response.status === 200) {
        toast({
          title: 'Sucesso',
          description: response.message
        });
        setIsDeleteDialogOpen(false);
        setPlanToDelete(null);
        fetchPlans();
      } else {
        toast({
          title: 'Erro',
          description: response.message,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('SubscriptionPlansManager: Error deleting plan:', error);
      toast({
        title: 'Erro',
        description: error?.message || 'Não foi possível excluir o plano',
        variant: 'destructive'
      });
    }
  };
  
  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    planToDelete,
    deletePlan,
    handleDeleteConfirm,
    isLoadingDelete: isLoading
  };
};
