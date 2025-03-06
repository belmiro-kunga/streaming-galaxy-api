
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
      // Try to get user from Supabase
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
      // Try to get all active plans, not just from the local subscription
      const { data: subscriptionPlans, error } = await supabase
        .from('planos_assinatura')
        .select(`
          *,
          precos:precos_planos(*)
        `)
        .eq('ativo', true);

      if (error) throw error;

      console.log("SubscriptionPlans: Plans fetched successfully:", subscriptionPlans?.length);
      console.log("SubscriptionPlans: Plans data:", subscriptionPlans);
      
      if (subscriptionPlans && subscriptionPlans.length === 0) {
        // If no plans from Supabase, fallback to planAPI
        console.log("SubscriptionPlans: No plans found in Supabase, trying planAPI");
        const apiPlans = await planAPI.getAllPlans();
        console.log("SubscriptionPlans: Plans from API:", apiPlans.length);
        setPlans(apiPlans || []);
      } else {
        setPlans(subscriptionPlans || []);
      }
    } catch (error) {
      console.error('SubscriptionPlans: Error fetching plans:', error);
      
      // Fallback to the planAPI if Supabase fails
      console.log("SubscriptionPlans: Error with Supabase, falling back to planAPI");
      try {
        const apiPlans = await planAPI.getAllPlans();
        console.log("SubscriptionPlans: Plans from API fallback:", apiPlans.length);
        setPlans(apiPlans || []);
      } catch (fallbackError) {
        console.error('SubscriptionPlans: Error with fallback method:', fallbackError);
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
    console.log("SubscriptionPlans: Setting up subscription to plan changes");
    
    fetchPlans();
    
    // Subscribe to changes in planos_assinatura table
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
          console.log("SubscriptionPlans: Plans changed, refreshing data", payload);
          fetchPlans();
        }
      )
      .subscribe();
    
    return () => {
      console.log("SubscriptionPlans: Unsubscribing from plan changes");
      subscription.unsubscribe();
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
