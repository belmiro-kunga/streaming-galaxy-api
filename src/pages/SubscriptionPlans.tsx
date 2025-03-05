
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, CreditCard, Award, Smartphone, Download, MonitorPlay, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/ui/Header';

// Define subscription plan types
interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  cycle: string;
  features: PlanFeature[];
  devices: number;
  downloads: number;
  quality: string;
  color: string;
  popular?: boolean;
}

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
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

  // Define subscription plans
  const plans: Plan[] = [
    {
      id: 'weekly',
      name: 'Plano Semanal',
      description: 'Ideal para períodos curtos',
      price: 500,
      currency: 'AOA',
      cycle: 'por semana',
      devices: 1,
      downloads: 5,
      quality: 'HD',
      color: 'bg-blue-500',
      features: [
        { name: 'Conteúdo HD', included: true },
        { name: '1 dispositivo', included: true },
        { name: '5 downloads', included: true },
        { name: 'Cancelamento a qualquer momento', included: true },
        { name: 'Sem anúncios', included: false },
        { name: 'Conteúdo Ultra HD', included: false },
      ]
    },
    {
      id: 'biweekly',
      name: 'Plano Quinzenal',
      description: 'Para quem deseja mais flexibilidade',
      price: 850,
      currency: 'AOA',
      cycle: 'por quinzena',
      devices: 2,
      downloads: 10,
      quality: 'HD',
      color: 'bg-purple-500',
      features: [
        { name: 'Conteúdo HD', included: true },
        { name: '2 dispositivos', included: true },
        { name: '10 downloads', included: true },
        { name: 'Cancelamento a qualquer momento', included: true },
        { name: 'Sem anúncios', included: true },
        { name: 'Conteúdo Ultra HD', included: false },
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Nossa opção mais popular',
      price: 3000,
      currency: 'AOA',
      cycle: 'por mês',
      devices: 2,
      downloads: 20,
      quality: 'HD',
      color: 'bg-green-500',
      popular: true,
      features: [
        { name: 'Conteúdo HD', included: true },
        { name: '2 dispositivos', included: true },
        { name: '20 downloads', included: true },
        { name: 'Cancelamento a qualquer momento', included: true },
        { name: 'Sem anúncios', included: true },
        { name: 'Conteúdo Ultra HD', included: false },
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Melhor experiência para famílias',
      price: 5000,
      currency: 'AOA',
      cycle: 'por mês',
      devices: 4,
      downloads: 40,
      quality: 'Ultra HD',
      color: 'bg-red-500',
      features: [
        { name: 'Conteúdo HD e Ultra HD', included: true },
        { name: '4 dispositivos', included: true },
        { name: '40 downloads', included: true },
        { name: 'Cancelamento a qualquer momento', included: true },
        { name: 'Sem anúncios', included: true },
        { name: 'Conteúdo exclusivo', included: true },
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: "Plano selecionado",
      description: `Você selecionou o plano ${plans.find(p => p.id === planId)?.name}`,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
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
                } ${plan.popular ? 'relative overflow-hidden' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -right-12 top-6 rotate-45 bg-primary text-primary-foreground px-12 py-1 text-sm font-medium">
                    Popular
                  </div>
                )}
                
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full ${plan.color} mb-4 mx-auto flex items-center justify-center`}>
                    <span className="text-white font-bold text-xl">
                      {plan.name.charAt(0)}
                    </span>
                  </div>
                  <CardTitle className="text-center">{plan.name}</CardTitle>
                  <p className="text-center text-muted-foreground mt-1">{plan.description}</p>
                  
                  <div className="text-center mt-4 mb-2">
                    <p className="text-4xl font-bold">
                      {plan.currency} {plan.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {plan.cycle}
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <span className="flex-1">{plan.devices} {plan.devices === 1 ? 'dispositivo' : 'dispositivos'}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Download className="h-5 w-5 text-muted-foreground" />
                      <span className="flex-1">{plan.downloads} downloads</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <MonitorPlay className="h-5 w-5 text-muted-foreground" />
                      <span className="flex-1">Qualidade {plan.quality}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">O que está incluído:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
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
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            onClick={handleSubscribe}
            disabled={!selectedPlan}
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
