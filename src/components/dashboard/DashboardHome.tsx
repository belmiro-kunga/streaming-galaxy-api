
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase/client';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { profile } = useUser();
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
      if (!profile?.id) return;
      
      setIsLoadingSubscription(true);
      try {
        // Try to get subscription from Supabase
        const { data, error } = await supabase
          .from('assinaturas_usuario')
          .select('*, planos_assinatura(nome, precos(preco, moeda_codigo))')
          .eq('usuario_id', profile.id)
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
  }, [profile?.id]);

  const watchHistory = [
    { id: '1', title: 'O Gambito da Rainha', progress: 75, image: 'https://via.placeholder.com/300x170' },
    { id: '2', title: 'Stranger Things', progress: 40, image: 'https://via.placeholder.com/300x170' },
    { id: '3', title: 'Breaking Bad', progress: 90, image: 'https://via.placeholder.com/300x170' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Olá, {profile?.first_name || 'Usuário'}!
              </h2>
              <p className="text-gray-300">Bem-vindo de volta à CinePlay</p>
            </div>
            <Button className="mt-4 md:mt-0" size="lg">
              <Gift className="mr-2 h-5 w-5" />
              Convide amigos
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Resumo da Assinatura</h2>
      <SubscriptionSummary 
        userSubscription={userSubscription}
        isLoadingSubscription={isLoadingSubscription}
        onSubscribeClick={() => navigate('/subscription-plans')}
      />

      <h2 className="text-xl font-bold mb-4">Continue Assistindo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchHistory.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

// Subscription Summary Component
interface SubscriptionSummaryProps {
  userSubscription: {
    plan: string;
    startDate: string;
    nextBillingDate: string;
    price: string;
    status: string;
  } | null;
  isLoadingSubscription: boolean;
  onSubscribeClick: () => void;
}

const SubscriptionSummary = ({ 
  userSubscription, 
  isLoadingSubscription,
  onSubscribeClick
}: SubscriptionSummaryProps) => {
  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardContent className="p-6">
        {isLoadingSubscription ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Plano atual</p>
              <p className="text-xl font-semibold">{userSubscription?.plan || 'Sem Subscrição Ativa'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Próxima cobrança</p>
              <p className="text-xl font-semibold">{userSubscription?.nextBillingDate || '-'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Valor mensal</p>
              <p className="text-xl font-semibold">{userSubscription?.price || '-'}</p>
            </div>
          </div>
        )}
        
        {!isLoadingSubscription && userSubscription?.status === 'Sem Subscrição Ativa' && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <Button 
              onClick={onSubscribeClick}
              className="bg-primary hover:bg-primary/90"
            >
              Assinar Agora
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Content Card Component
interface ContentCardProps {
  item: {
    id: string;
    title: string;
    progress: number;
    image: string;
  };
}

const ContentCard = ({ item }: ContentCardProps) => {
  return (
    <Card className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
      <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{item.title}</h3>
        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
        </div>
        <p className="text-xs text-gray-400">{item.progress}% assistido</p>
      </CardContent>
    </Card>
  );
};

export default DashboardHome;
