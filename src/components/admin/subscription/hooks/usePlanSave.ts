
import { useState } from 'react';
import { SubscriptionPlan } from '@/types/api';
import { useToast } from "@/hooks/use-toast";
import { directSupabaseApi } from '@/lib/supabase';
import { usePlanValidation } from './usePlanValidation';

export const usePlanSave = (
  currentPlan: Partial<SubscriptionPlan> | null,
  dialogMode: "add" | "edit",
  fetchPlans: () => Promise<void>,
  setIsPlanDialogOpen: (open: boolean) => void,
  setFormError: (error: string | null) => void
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { validatePlan } = usePlanValidation();
  
  const handleSavePlan = async () => {
    const validation = validatePlan(currentPlan);
    if (!validation.valid) {
      setFormError(validation.error);
      toast({
        title: 'Erro de validação',
        description: validation.error || 'Verifique os dados do formulário',
        variant: 'destructive'
      });
      return;
    }
    
    // Make sure all numeric fields are numbers, not strings
    const planToSave = {
      ...currentPlan,
      telas_simultaneas: Number(currentPlan?.telas_simultaneas) || 1,
      limite_downloads: Number(currentPlan?.limite_downloads) || 0,
      limite_perfis: Number(currentPlan?.limite_perfis) || 1,
      precos: currentPlan?.precos?.map(preco => ({
        ...preco,
        preco: Number(preco.preco) || 0
      }))
    };
    
    try {
      console.log("SubscriptionPlansManager: Saving plan:", planToSave);
      
      if (dialogMode === "add") {
        setIsLoading(true);
        const response = await directSupabaseApi.createPlan(planToSave as Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>);
        setIsLoading(false);
        
        if (response.status === 201) {
          toast({
            title: 'Sucesso',
            description: 'Plano criado com sucesso'
          });
          setIsPlanDialogOpen(false);
          console.log("SubscriptionPlansManager: Plan created successfully");
          fetchPlans();
        } else {
          console.error("SubscriptionPlansManager: Error response from API:", response);
          toast({
            title: 'Erro',
            description: response.message || 'Erro ao criar plano',
            variant: 'destructive'
          });
        }
      } else {
        if (!planToSave.id) {
          toast({
            title: 'Erro',
            description: 'ID do plano não encontrado',
            variant: 'destructive'
          });
          return;
        }
        
        setIsLoading(true);
        const response = await directSupabaseApi.updatePlan(planToSave.id, planToSave);
        setIsLoading(false);
        
        if (response.status === 200) {
          toast({
            title: 'Sucesso',
            description: 'Plano atualizado com sucesso'
          });
          setIsPlanDialogOpen(false);
          console.log("SubscriptionPlansManager: Plan updated successfully");
          fetchPlans();
        } else {
          toast({
            title: 'Erro',
            description: response.message || 'Erro ao atualizar plano',
            variant: 'destructive'
          });
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('SubscriptionPlansManager: Error saving plan:', error);
      toast({
        title: 'Erro',
        description: error?.message || 'Não foi possível salvar o plano',
        variant: 'destructive'
      });
    }
  };
  
  return {
    handleSavePlan,
    isLoadingSave: isLoading
  };
};
