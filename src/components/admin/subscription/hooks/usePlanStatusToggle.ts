
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { directSupabaseApi } from '@/lib/supabase';

export const usePlanStatusToggle = (fetchPlans: () => Promise<void>) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      setIsLoading(true);
      console.log(`SubscriptionPlansManager: Toggling plan status for ${planId} to ${!currentStatus}`);
      const response = await directSupabaseApi.togglePlanStatus(planId, !currentStatus);
      setIsLoading(false);
      
      if (response.status === 200) {
        toast({
          title: 'Sucesso',
          description: response.message
        });
      } else {
        toast({
          title: 'Erro',
          description: response.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error('SubscriptionPlansManager: Error toggling plan status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do plano',
        variant: 'destructive'
      });
    }
  };
  
  return {
    togglePlanStatus,
    isLoadingToggle: isLoading
  };
};
