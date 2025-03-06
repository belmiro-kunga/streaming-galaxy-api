
import { useState, useCallback, useEffect } from 'react';
import { SubscriptionPlan } from '@/types/api';
import { useToast } from "@/hooks/use-toast";
import { supabase, directSupabaseApi } from '@/lib/supabase';

export const usePlanManagement = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<SubscriptionPlan> | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [formError, setFormError] = useState<string | null>(null);
  
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("SubscriptionPlansManager: Fetching plans using direct Supabase API");
      const data = await directSupabaseApi.getAllPlans();
      console.log("SubscriptionPlansManager: Plans fetched successfully:", data.length);
      setPlans(data);
    } catch (error) {
      console.error('SubscriptionPlansManager: Error fetching plans:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os planos de assinatura',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchPlans();
    
    // Setup realtime listeners
    const plansChannel = supabase
      .channel('public:planos_assinatura')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'planos_assinatura'
      }, (payload) => {
        console.log("SubscriptionPlansManager: Real-time update received", payload);
        fetchPlans();
      })
      .subscribe();
    
    const priceChannel = supabase
      .channel('public:precos_planos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'precos_planos'
      }, (payload) => {
        console.log("SubscriptionPlansManager: Real-time price update received", payload);
        fetchPlans();
      })
      .subscribe();
    
    return () => {
      console.log("SubscriptionPlansManager: Cleaning up channels");
      supabase.removeChannel(plansChannel);
      supabase.removeChannel(priceChannel);
    };
  }, [fetchPlans]);
  
  const addPlan = () => {
    setFormError(null);
    setDialogMode("add");
    setCurrentPlan({
      nome: "",
      descricao: "",
      qualidade_maxima: "HD",
      telas_simultaneas: 1,
      limite_downloads: 10,
      limite_perfis: 1,
      ciclo_cobranca: "mensal",
      ativo: true,
      precos: [{ 
        moeda_codigo: "AOA", 
        preco: 0,
        plano_id: `temp-${Date.now()}`
      }]
    });
    setIsPlanDialogOpen(true);
  };
  
  const editPlan = (plan: SubscriptionPlan) => {
    setFormError(null);
    setDialogMode("edit");
    setCurrentPlan({ ...plan });
    setIsPlanDialogOpen(true);
  };
  
  const deletePlan = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setIsDeleteDialogOpen(true);
  };
  
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
  
  const validatePlan = () => {
    if (!currentPlan) {
      setFormError('Dados do plano inválidos');
      return false;
    }
    
    // Validate required fields
    if (!currentPlan.nome) {
      setFormError('O nome do plano é obrigatório');
      return false;
    }
    
    // Validate numeric fields
    if (currentPlan.telas_simultaneas && isNaN(Number(currentPlan.telas_simultaneas))) {
      setFormError('O número de telas simultâneas deve ser um número');
      return false;
    }
    
    if (currentPlan.limite_downloads && isNaN(Number(currentPlan.limite_downloads))) {
      setFormError('O limite de downloads deve ser um número');
      return false;
    }
    
    if (currentPlan.limite_perfis && isNaN(Number(currentPlan.limite_perfis))) {
      setFormError('O limite de perfis deve ser um número');
      return false;
    }
    
    if (currentPlan.precos && currentPlan.precos.length > 0) {
      const price = currentPlan.precos[0].preco;
      if (isNaN(Number(price))) {
        setFormError('O preço deve ser um número');
        return false;
      }
    }
    
    setFormError(null);
    return true;
  };
  
  const handleSavePlan = async () => {
    if (!validatePlan()) {
      toast({
        title: 'Erro de validação',
        description: formError || 'Verifique os dados do formulário',
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
  
  const handlePriceChange = (value: string) => {
    if (!currentPlan || !currentPlan.precos || currentPlan.precos.length === 0) return;
    
    const precos = [...currentPlan.precos];
    const planId = currentPlan.id || `temp-${Date.now()}`;
    
    precos[0] = { 
      ...precos[0], 
      preco: Number(value) || 0,
      plano_id: precos[0].plano_id || planId
    };
    
    setCurrentPlan({
      ...currentPlan,
      precos
    });
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
    plans,
    isLoading,
    isPlanDialogOpen,
    setIsPlanDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentPlan,
    setCurrentPlan,
    planToDelete,
    dialogMode,
    formError,
    addPlan,
    editPlan,
    deletePlan,
    togglePlanStatus,
    handleSavePlan,
    handlePriceChange,
    handleDeleteConfirm
  };
};
