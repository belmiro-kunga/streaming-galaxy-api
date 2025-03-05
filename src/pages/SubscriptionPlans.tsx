
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
      id: 'threeweeks',
      name: 'Plano Três Semanas',
      description: 'Ideal para períodos médios',
      price: 1200,
      currency: 'AOA',
      cycle: 'por três semanas',
      devices: 2,
      downloads: 15,
      quality: 'HD',
      color: 'bg-indigo-500',
      features: [
        { name: 'Conteúdo HD', included: true },
        { name: '2 dispositivos', included: true },
        { name: '15 downloads', included: true },
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
    },
    {
      id: 'gold',
      name: 'Gold',
      description: 'Experiência premium completa',
      price: 7500,
      currency: 'AOA',
      cycle: 'por mês',
      devices: 6,
      downloads: 100,
      quality: 'Ultra HD + HDR',
      color: 'bg-yellow-500',
      features: [
        { name: 'Conteúdo Ultra HD + HDR', included: true },
        { name: '6 dispositivos', included: true },
        { name: '100 downloads', included: true },
        { name: 'Cancelamento a qualquer momento', included: true },
        { name: 'Sem anúncios', included: true },
        { name: 'Todo o conteúdo exclusivo', included: true },
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

    toast({
      title: "Assinatura iniciada",
      description: "Você será redirecionado para o pagamento.",
    });
    
    // In a real app, this would navigate to a payment page
    // For now, just navigate back to home
    setTimeout(() => {
      navigate('/home');
    }, 2000);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className={`w-12 h-12 rounded-full ${plan.color} mb-4 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">
                      {plan.name.charAt(0)}
                    </span>
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    <p className="text-3xl font-bold">
                      {plan.currency} {plan.price.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {plan.cycle}
                      </span>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mr-2" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Badge variant="outline" className="w-full justify-center py-1">
                      {plan.devices} {plan.devices === 1 ? 'dispositivo' : 'dispositivos'}
                    </Badge>
                    <Badge variant="outline" className="w-full justify-center py-1">
                      {plan.downloads} downloads
                    </Badge>
                    <Badge variant="outline" className="w-full justify-center py-1">
                      Qualidade {plan.quality}
                    </Badge>
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
            className="px-8"
          >
            Assinar Agora
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Você pode cancelar sua assinatura a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
