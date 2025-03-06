
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase/client';

const DashboardSubscription = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [userSubscription, setUserSubscription] = useState<{
    plan: string;
    startDate: string;
    nextBillingDate: string;
    price: string;
    status: string;
  } | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  
  // Fetch user subscription data from Supabase
  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (!user?.id) return;
      
      setIsLoadingSubscription(true);
      try {
        // Try to get subscription from Supabase
        const { data, error } = await supabase
          .from('assinaturas_usuario')
          .select('*, planos_assinatura(nome, precos(preco, moeda_codigo))')
          .eq('usuario_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching subscription:', error);
        }
        
        if (data) {
          // User has subscription data
          setUserSubscription({
            plan: data.planos_assinatura?.nome || 'Plano Desconhecido',
            startDate: new Date(data.data_inicio).toLocaleDateString('pt-BR'),
            nextBillingDate: new Date(data.data_fim).toLocaleDateString('pt-BR'),
            price: data.planos_assinatura?.precos?.[0]
              ? `${data.planos_assinatura.precos[0].moeda_codigo} ${data.planos_assinatura.precos[0].preco}`
              : 'Preço não disponível',
            status: data.status === 'ativa' ? 'Ativo' : 'Inativo'
          });
        } else {
          // User has no subscription
          setUserSubscription({
            plan: 'Sem Subscrição Ativa',
            startDate: '-',
            nextBillingDate: '-',
            price: '-',
            status: 'Sem Subscrição Ativa'
          });
        }
      } catch (error) {
        console.error('Error in subscription fetch:', error);
        // Set fallback dummy data if fetch fails
        setUserSubscription({
          plan: 'Sem Subscrição Ativa',
          startDate: '-',
          nextBillingDate: '-',
          price: '-',
          status: 'Sem Subscrição Ativa'
        });
      } finally {
        setIsLoadingSubscription(false);
      }
    };
    
    fetchUserSubscription();
  }, [user?.id]);

  if (isLoadingSubscription) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userSubscription?.status === 'Sem Subscrição Ativa') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-4">Detalhes da Assinatura</h2>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Plano {userSubscription?.plan}</CardTitle>
            <CardDescription>
              Você não possui uma assinatura ativa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <p className="mb-6 text-gray-400">Você ainda não possui uma assinatura. Assine para ter acesso a todo o conteúdo.</p>
              <Button 
                onClick={() => navigate('/subscription-plans')} 
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Assinar Agora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Detalhes da Assinatura</h2>
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle>Plano {userSubscription?.plan}</CardTitle>
          <CardDescription>
            Assinado em {userSubscription?.startDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Próxima cobrança</p>
              <p className="text-lg">{userSubscription?.nextBillingDate}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Valor mensal</p>
              <p className="text-lg">{userSubscription?.price}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-lg">
                <span className={`inline-block w-2 h-2 ${userSubscription?.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></span>
                {userSubscription?.status}
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-800">
            <h3 className="font-semibold mb-3">Métodos de pagamento</h3>
            <div className="flex items-center p-3 bg-gray-800/50 rounded-lg">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-3"></div>
              <div>
                <p className="font-medium">Cartão final 4242</p>
                <p className="text-sm text-gray-400">Expira em 12/25</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
              Alterar plano
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
              Atualizar forma de pagamento
            </Button>
            <Button variant="destructive">
              Cancelar assinatura
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSubscription;
