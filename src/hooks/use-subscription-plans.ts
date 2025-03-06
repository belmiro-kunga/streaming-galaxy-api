
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { planAPI } from '@/services/plans';
import { SubscriptionPlan } from '@/types/api';
import { supabase } from '@/lib/supabase';

export const useSubscriptionPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      const { data } = await supabase.auth.getSession();
      const hasSession = data.session || localStorage.getItem('userSession');
      setIsLoggedIn(!!hasSession);
    };
    
    checkLoginStatus();
  }, []);

  // Function to fetch plans
  const fetchPlans = useCallback(async () => {
    console.log("SubscriptionPlans: Fetching plans");
    setIsLoading(true);
    try {
      // Using planAPI to be consistent with admin panel operations
      const plans = await planAPI.getAllPlans();
      console.log("SubscriptionPlans: Plans fetched successfully:", plans.length);
      
      // Filter only active plans
      const activePlans = plans.filter(plan => plan.ativo);
      console.log("SubscriptionPlans: Active plans:", activePlans.length);
      
      setPlans(activePlans);
    } catch (error) {
      console.error('SubscriptionPlans: Error fetching plans:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos de assinatura.",
        variant: "destructive"
      });
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Subscribe to plan changes
  useEffect(() => {
    console.log("SubscriptionPlans: Setting up subscription to plan changes");
    
    fetchPlans();
    
    // Use planAPI.subscribeToChanges to be consistent with admin panel
    const unsubscribe = planAPI.subscribeToChanges(() => {
      console.log("SubscriptionPlans: Plans changed, refreshing data");
      fetchPlans();
    });
    
    return () => {
      console.log("SubscriptionPlans: Cleaning up subscription");
      unsubscribe();
    };
  }, [fetchPlans]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    toast({
      title: "Plano selecionado",
      description: `Você selecionou o plano ${plan?.nome}`,
    });
  };

  const handleSubscribe = () => {
    if (!selectedPlan) {
      toast({
        title: "Selecione um plano",
        description: "Por favor, selecione um plano antes de continuar.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedPlanDetails = plans.find(p => p.id === selectedPlan);
    
    if (!isLoggedIn) {
      // Redirect to login page if user is not logged in
      toast({
        title: "Login necessário",
        description: "Faça login para continuar com a assinatura.",
      });
      navigate('/login');
    } else if (selectedPlanDetails) {
      // Redirect to payment page if user is logged in and plan is selected
      navigate('/payment-upload', { state: { plan: selectedPlanDetails } });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível encontrar os detalhes do plano selecionado.",
        variant: "destructive"
      });
    }
  };

  return {
    plans,
    isLoading,
    selectedPlan,
    isLoggedIn,
    handleSelectPlan,
    handleSubscribe
  };
};
