
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { planAPI } from '@/services/plans';
import { SubscriptionPlan } from '@/types/api';
import { supabase, directSupabaseApi } from '@/lib/supabase';

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
    console.log("SubscriptionPlans: Fetching plans using direct Supabase API");
    setIsLoading(true);
    try {
      // Use the direct Supabase API
      const plans = await directSupabaseApi.getAllPlans();
      console.log("SubscriptionPlans: All plans fetched, count:", plans.length);
      
      // Filter only active plans
      const activePlans = plans.filter(plan => plan.ativo);
      console.log("SubscriptionPlans: Active plans count:", activePlans.length);
      
      setPlans(activePlans);
    } catch (error) {
      console.error('SubscriptionPlans: Error fetching plans, falling back to planAPI:', error);
      
      try {
        // Fallback to planAPI if the direct API fails
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

  // Subscribe to plan changes
  useEffect(() => {
    console.log("SubscriptionPlans: Setting up subscriptions to plan changes");
    
    fetchPlans();
    
    // Subscribe to Supabase changes for plans
    const plansChannel = supabase
      .channel('public:planos_assinatura')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'planos_assinatura'
      }, (payload) => {
        console.log("SubscriptionPlans: Plans changed in Supabase, refreshing data", payload);
        fetchPlans();
      })
      .subscribe();
    
    // Subscribe to Supabase changes for prices
    const pricesChannel = supabase
      .channel('public:precos_planos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'precos_planos'
      }, (payload) => {
        console.log("SubscriptionPlans: Prices changed in Supabase, refreshing data", payload);
        fetchPlans();
      })
      .subscribe();
    
    return () => {
      console.log("SubscriptionPlans: Cleaning up subscriptions");
      plansChannel.unsubscribe();
      pricesChannel.unsubscribe();
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
