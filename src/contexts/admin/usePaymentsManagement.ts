
import { useCallback, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mockPendingPayments } from './mockData';
import { Payment } from './types';
import { supabase } from '@/lib/supabase/client';

export const usePaymentsManagement = () => {
  const { toast } = useToast();
  const [pendingPayments, setPendingPayments] = useState<Payment[]>(mockPendingPayments);
  
  // Carregar pagamentos pendentes do Supabase
  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const { data, error } = await supabase
          .from('pagamentos')
          .select('*, perfis_usuario(first_name, last_name, email), planos_assinatura(nome, precos(preco, moeda_codigo))')
          .eq('status', 'pendente');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedPayments = data.map(payment => ({
            id: payment.id,
            user: `${payment.perfis_usuario?.first_name || ''} ${payment.perfis_usuario?.last_name || ''}`,
            user_id: payment.usuario_id,
            plan: payment.planos_assinatura?.nome || 'Plano desconhecido',
            plan_id: payment.plano_id,
            amount: payment.planos_assinatura?.precos?.[0] 
              ? `${payment.planos_assinatura?.precos[0].moeda_codigo} ${payment.planos_assinatura?.precos[0].preco}`
              : 'Preço indisponível',
            date: new Date(payment.created_at).toLocaleDateString('pt-BR'),
            status: payment.status,
            payment_proof_url: payment.comprovativo_url
          }));
          
          setPendingPayments(formattedPayments);
        }
      } catch (error) {
        console.error('Erro ao carregar pagamentos pendentes:', error);
        // Se houver erro, manter os dados simulados
      }
    };
    
    fetchPendingPayments();
    
    // Inscrever-se para atualizações em tempo real
    const channel = supabase
      .channel('pagamentos-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pagamentos'
      }, () => {
        fetchPendingPayments();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const approvePayment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('pagamentos')
        .update({ status: 'aprovado' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Atualizar o estado local
      setPendingPayments(prev => prev.filter(payment => payment.id !== id));
      
      // Buscar os detalhes do pagamento para criar a assinatura
      const { data: paymentData } = await supabase
        .from('pagamentos')
        .select('usuario_id, plano_id, moeda_codigo')
        .eq('id', id)
        .single();
        
      if (paymentData) {
        // Calcular datas de início e fim (1 mês)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        
        // Criar assinatura ativa para o usuário
        await supabase.from('assinaturas_usuario').insert({
          usuario_id: paymentData.usuario_id,
          plano_id: paymentData.plano_id,
          moeda_codigo: paymentData.moeda_codigo,
          data_inicio: startDate.toISOString().split('T')[0],
          data_fim: endDate.toISOString().split('T')[0],
          status: 'ativa'
        });
      }
      
      toast({
        title: "Pagamento aprovado",
        description: `O pagamento ${id} foi aprovado com sucesso.`
      });
    } catch (error) {
      console.error('Erro ao aprovar pagamento:', error);
      toast({
        title: "Erro ao aprovar pagamento",
        description: "Ocorreu um erro ao aprovar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  const rejectPayment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('pagamentos')
        .update({ status: 'rejeitado' })
        .eq('id', id);
        
      if (error) throw error;
      
      // Atualizar o estado local
      setPendingPayments(prev => prev.filter(payment => payment.id !== id));
      
      toast({
        title: "Pagamento rejeitado",
        description: `O pagamento ${id} foi rejeitado.`
      });
    } catch (error) {
      console.error('Erro ao rejeitar pagamento:', error);
      toast({
        title: "Erro ao rejeitar pagamento",
        description: "Ocorreu um erro ao rejeitar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    pendingPayments,
    approvePayment,
    rejectPayment
  };
};
