
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockPendingPayments } from './mockData';
import { Payment } from './types';

export const usePaymentsManagement = () => {
  const { toast } = useToast();
  
  // All pending payments are coming from mock data for now
  const pendingPayments = mockPendingPayments;
  
  const approvePayment = useCallback((id: string) => {
    toast({
      title: "Pagamento aprovado",
      description: `O pagamento ${id} foi aprovado com sucesso.`
    });
    // In a real app, we would update the payment state here
  }, [toast]);
  
  const rejectPayment = useCallback((id: string) => {
    toast({
      title: "Pagamento rejeitado",
      description: `O pagamento ${id} foi rejeitado.`
    });
    // In a real app, we would update the payment state here
  }, [toast]);

  return {
    pendingPayments,
    approvePayment,
    rejectPayment
  };
};
