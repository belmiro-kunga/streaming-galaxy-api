
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
      // First try to get plans directly from Supabase
      const { data: subscriptionPlans, error } = await supabase
        .from('planos_assinatura')
        .select(`
          *,
          precos:precos_planos(*)
        `)
        .eq('ativo', true); // Only active plans
      
      if (error) {
        console.error('SubscriptionPlans: Supabase error:', error);
        throw error;
      }
      
      if (subscriptionPlans && subscriptionPlans.length > 0) {
        console.log("SubscriptionPlans: Active plans fetched from Supabase:", subscriptionPlans.length);
        setPlans(subscriptionPlans);
      } else {
        console.log("SubscriptionPlans: No active plans found in Supabase, falling back to planAPI");
        // Fallback to planAPI if no plans found in Supabase
        const apiPlans = await planAPI.getAllPlans();
        console.log("SubscriptionPlans: Plans fetched from API:", apiPlans.length);
        
        // Filter only active plans
        const activePlans = apiPlans.filter(plan => plan.ativo);
        console.log("SubscriptionPlans: Active plans from API:", activePlans.length);
        
        setPlans(activePlans);
      }
    } catch (error) {
      console.error('SubscriptionPlans: Error fetching plans, falling back to planAPI:', error);
      
      try {
        // Fallback to planAPI if Supabase query fails
        const apiPlans = await planAPI.getAllPlans();
        const activePlans = apiPlans.filter(plan => plan.ativo);
        console.log("SubscriptionPlans: Active plans from API fallback:", activePlans.length);
        setPlans(activePlans);
      } catch (apiError) {
        console.error('SubscriptionPlans: Error from API fallback:', apiError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os planos de assinatura.",
          variant: "destructive"
        });
        setPlans([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Subscribe to plan changes from both Supabase and planAPI
  useEffect(() => {
    console.log("SubscriptionPlans: Setting up subscriptions to plan changes");
    
    fetchPlans();
    
    // Subscribe to Supabase changes
    const subscription = supabase
      .channel('planos_assinatura_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'planos_assinatura'
        },
        (payload) => {
          console.log("SubscriptionPlans: Plans changed in Supabase, refreshing data", payload);
          fetchPlans();
        }
      )
      .subscribe();
    
    // Also use planAPI.subscribeToChanges to be consistent with admin panel
    const apiUnsubscribe = planAPI.subscribeToChanges(() => {
      console.log("SubscriptionPlans: Plans changed in API, refreshing data");
      fetchPlans();
    });
    
    return () => {
      console.log("SubscriptionPlans: Cleaning up subscriptions");
      subscription.unsubscribe();
      apiUnsubscribe();
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
