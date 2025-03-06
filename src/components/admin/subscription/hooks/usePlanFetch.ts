
import { useState, useCallback, useEffect } from 'react';
import { SubscriptionPlan } from '@/types/api';
import { useToast } from "@/hooks/use-toast";
import { supabase, directSupabaseApi } from '@/lib/supabase';

export const usePlanFetch = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  return {
    plans,
    isLoading,
    fetchPlans
  };
};
