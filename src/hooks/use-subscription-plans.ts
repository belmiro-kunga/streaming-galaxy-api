
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { planAPI } from '@/services/plans';
import { SubscriptionPlan } from '@/types/api';

export const useSubscriptionPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check login status - in a real app, this would be from auth context
  useEffect(() => {
    // Mock check for logged in status - in a real app, this would come from an auth context
    const checkLoginStatus = () => {
      // This is a mock implementation - replace with actual auth logic
      const hasSession = localStorage.getItem('userSession');
      setIsLoggedIn(!!hasSession);
    };
    
    checkLoginStatus();
  }, []);

  // Function to fetch plans
  const fetchPlans = useCallback(async () => {
    console.log("SubscriptionPlans: Fetching plans");
    setIsLoading(true);
    try {
      const data = await planAPI.getAllPlans();
      console.log("SubscriptionPlans: Plans fetched successfully:", data.length);
      // Only show active plans
      const activePlans = data.filter(plan => plan.ativo);
      console.log("SubscriptionPlans: Active plans:", activePlans.length);
      setPlans(activePlans);
    } catch (error) {
      console.error('SubscriptionPlans: Error fetching plans:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos de assinatura.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Set up subscription to plan changes
  useEffect(() => {
    console.log("SubscriptionPlans: Setting up subscription to plan changes");
    
    // Subscribe to plan changes
    const unsubscribe = planAPI.subscribeToChanges(() => {
      console.log("SubscriptionPlans: Plans changed, refreshing data");
      fetchPlans();
    });
    
    // Cleanup subscription when component unmounts
    return () => {
      console.log("SubscriptionPlans: Unsubscribing from plan changes");
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
    } else {
      // Redirect to payment page if user is logged in
      navigate('/payment-upload', { state: { plan: selectedPlanDetails } });
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
