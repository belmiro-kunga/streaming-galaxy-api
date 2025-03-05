
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, CreditCard, Smartphone, Download, MonitorPlay, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/ui/Header';
import { planAPI } from '@/services/planAPI';
import { SubscriptionPlan } from '@/types/api';

const SubscriptionPlans = () => {
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

  // Load subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const data = await planAPI.getAllPlans();
        setPlans(data.filter(plan => plan.ativo));  // Only show active plans
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

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

  // Helper function to format plan prices
  const formatPrice = (plan: SubscriptionPlan) => {
    if (!plan.precos || plan.precos.length === 0) return "Preço não disponível";
    const preco = plan.precos[0];
    return `${preco.moeda_codigo} ${preco.preco.toLocaleString()}`;
  };

  // Helper function to get the billing cycle in Portuguese
  const formatCycle = (cycle: string) => {
    const cycleMappings: Record<string, string> = {
      'diário': 'por dia',
      'semanal': 'por semana',
      'quinzenal': 'por quinzena',
      'mensal': 'por mês',
      'trimestral': 'por trimestre',
      'semestral': 'por semestre',
      'anual': 'por ano'
    };
    
    return cycleMappings[cycle] || cycle;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Escolha seu plano</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre o plano perfeito para sua experiência de streaming. Todos os planos incluem acesso ao nosso catálogo completo.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => {
              // Define popular plans based on some business logic
              const isPopular = plan.id === "standard" || plan.nome === "Standard";
              
              // Generate features list from plan attributes
              const features = [
                { name: `Conteúdo ${plan.qualidade_maxima}`, included: true },
                { name: `${plan.telas_simultaneas} ${plan.telas_simultaneas === 1 ? 'dispositivo' : 'dispositivos'}`, included: true },
                { name: `${plan.limite_downloads} downloads`, included: true },
                { name: 'Cancelamento a qualquer momento', included: true },
                { name: 'Sem anúncios', included: plan.nome !== "Plano Semanal" && plan.nome !== "Básico" },
                { name: 'Conteúdo Ultra HD', included: plan.qualidade_maxima === "Ultra HD" || plan.qualidade_maxima === "4K" },
                { name: `Até ${plan.limite_perfis} ${plan.limite_perfis === 1 ? 'perfil' : 'perfis'}`, included: true }
              ];
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className={`h-full border-2 transition-all ${
                      selectedPlan === plan.id 
                        ? 'border-primary shadow-lg scale-[1.02]' 
                        : 'border-border hover:border-primary/50'
                    } ${isPopular ? 'relative overflow-hidden' : ''}`}
                  >
                    {isPopular && (
                      <div className="absolute -right-12 top-6 rotate-45 bg-primary text-primary-foreground px-12 py-1 text-sm font-medium">
                        Popular
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-full bg-${plan.id === "weekly" ? "blue" : plan.id === "biweekly" ? "purple" : plan.id === "standard" ? "green" : "red"}-500 mb-4 mx-auto flex items-center justify-center`}>
                        <span className="text-white font-bold text-xl">
                          {plan.nome.charAt(0)}
                        </span>
                      </div>
                      <CardTitle className="text-center">{plan.nome}</CardTitle>
                      <p className="text-center text-muted-foreground mt-1">{plan.descricao}</p>
                      
                      <div className="text-center mt-4 mb-2">
                        <p className="text-4xl font-bold">
                          {formatPrice(plan)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCycle(plan.ciclo_cobranca)}
                        </p>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <span className="flex-1">{plan.telas_simultaneas} {plan.telas_simultaneas === 1 ? 'dispositivo' : 'dispositivos'}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <Download className="h-5 w-5 text-muted-foreground" />
                          <span className="flex-1">{plan.limite_downloads} downloads</span>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <MonitorPlay className="h-5 w-5 text-muted-foreground" />
                          <span className="flex-1">Qualidade {plan.qualidade_maxima}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">O que está incluído:</h4>
                        <ul className="space-y-2">
                          {features.map((feature, i) => (
                            <li key={i} className="flex items-center">
                              {feature.included ? (
                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                              )}
                              <span className={feature.included ? '' : 'text-muted-foreground'}>
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        variant={selectedPlan === plan.id ? "default" : "outline"} 
                        className="w-full"
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? 'Selecionado' : 'Selecionar'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            onClick={handleSubscribe}
            disabled={!selectedPlan || isLoading}
            className="px-8 py-6 text-lg"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Assinar Agora
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Você pode cancelar sua assinatura a qualquer momento.
            {!isLoggedIn && " É necessário fazer login para continuar."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
