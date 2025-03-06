import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { SubscriptionPlan } from '@/types/api';

interface PlanCardProps {
  plan: SubscriptionPlan;
  index: number;
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
}

export const PlanCard = ({ plan, index, selectedPlan, onSelectPlan }: PlanCardProps) => {
  const isSelected = selectedPlan === plan.id;
  const isPopular = plan.nome.toLowerCase().includes('standard');
  
  const animationDelay = `${index * 0.1}s`;
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const planPrice = plan.precos && plan.precos.length > 0 
    ? plan.precos[0].preco 
    : 0;

  const getCycleLabel = (cycle: string): string => {
    const cycles: Record<string, string> = {
      'mensal': '/mês',
      'anual': '/ano',
      'trimestral': '/trimestre',
      'semestral': '/semestre',
      'diário': '/dia',
      'semanal': '/semana',
      'quinzenal': '/quinzena'
    };
    return cycles[cycle] || '';
  };

  return (
    <div 
      className="animate-fade-in" 
      style={{ animationDelay }}
    >
      <Card 
        className={`relative overflow-hidden transition-all duration-300 h-full 
                  ${isSelected 
                    ? 'border-primary dark:border-violet-500 scale-105 shadow-xl' 
                    : 'border-border dark:border-gray-700 hover:border-primary/50 dark:hover:border-violet-600/50 shadow'} 
                  ${isPopular && !isSelected ? 'border-primary/50 dark:border-violet-600/50' : ''}
                  bg-card dark:bg-gray-800`}
        onClick={() => onSelectPlan(plan.id)}
      >
        {isPopular && (
          <div className="absolute top-0 right-0">
            <div className="bg-primary dark:bg-violet-500 text-primary-foreground dark:text-white px-4 py-1 text-xs font-medium transform rotate-45 translate-x-[30%] translate-y-[-30%] shadow-lg">
              Popular
            </div>
          </div>
        )}
        
        <CardHeader className="text-center pb-2">
          <h3 className="text-lg font-bold text-foreground dark:text-white">{plan.nome}</h3>
          <p className="text-3xl font-bold mt-2 text-foreground dark:text-white">
            {formatPrice(planPrice)}
            <span className="text-sm font-normal text-muted-foreground dark:text-gray-400">
              {getCycleLabel(plan.ciclo_cobranca)}
            </span>
          </p>
        </CardHeader>
        
        <CardContent className="pt-4">
          <ul className="space-y-3">
            {plan.descricao ? (
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 dark:bg-violet-500/20 text-primary dark:text-violet-500 mt-0.5">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm text-muted-foreground dark:text-gray-300">{plan.descricao}</span>
              </li>
            ) : null}
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 dark:bg-violet-500/20 text-primary dark:text-violet-500 mt-0.5">
                <Check className="h-3 w-3" />
              </div>
              <span className="text-sm text-muted-foreground dark:text-gray-300">
                {plan.qualidade_maxima ? `Qualidade ${plan.qualidade_maxima}` : 'Alta qualidade'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 dark:bg-violet-500/20 text-primary dark:text-violet-500 mt-0.5">
                <Check className="h-3 w-3" />
              </div>
              <span className="text-sm text-muted-foreground dark:text-gray-300">
                {plan.telas_simultaneas} {plan.telas_simultaneas === 1 ? 'dispositivo' : 'dispositivos'} simultâneos
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 dark:bg-violet-500/20 text-primary dark:text-violet-500 mt-0.5">
                <Check className="h-3 w-3" />
              </div>
              <span className="text-sm text-muted-foreground dark:text-gray-300">
                {plan.limite_downloads} downloads
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 dark:bg-violet-500/20 text-primary dark:text-violet-500 mt-0.5">
                <Check className="h-3 w-3" />
              </div>
              <span className="text-sm text-muted-foreground dark:text-gray-300">
                {plan.limite_perfis} {plan.limite_perfis === 1 ? 'perfil' : 'perfis'}
              </span>
            </li>
          </ul>
        </CardContent>
        
        <CardFooter className="pt-4">
          <button 
            className={`w-full py-2 rounded-md text-sm font-medium transition-colors
                      ${isSelected 
                        ? 'bg-primary dark:bg-violet-500 text-primary-foreground dark:text-white' 
                        : 'bg-primary/10 dark:bg-violet-500/20 text-primary dark:text-violet-400 hover:bg-primary/20 dark:hover:bg-violet-500/30'}`}
          >
            {isSelected ? 'Selecionado' : 'Selecionar'}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};
