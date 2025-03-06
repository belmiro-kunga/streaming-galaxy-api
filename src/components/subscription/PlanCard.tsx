
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Smartphone, Download, MonitorPlay } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan } from '@/types/api';

interface PlanCardProps {
  plan: SubscriptionPlan;
  index: number;
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
}

export const PlanCard = ({ plan, index, selectedPlan, onSelectPlan }: PlanCardProps) => {
  // Define popular plans based on some business logic
  const isPopular = plan.id === "standard" || plan.nome === "Standard";
  
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
            onClick={() => onSelectPlan(plan.id)}
          >
            {selectedPlan === plan.id ? 'Selecionado' : 'Selecionar'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
