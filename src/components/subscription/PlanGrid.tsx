
import React from 'react';
import { PlanCard } from './PlanCard';
import { SubscriptionPlan } from '@/types/api';

interface PlanGridProps {
  plans: SubscriptionPlan[];
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
  isLoading: boolean;
}

export const PlanGrid = ({ plans, selectedPlan, onSelectPlan, isLoading }: PlanGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-violet-500"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nenhum plano ativo disponível
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          No momento não há planos de assinatura ativos. Por favor, entre em contato com o administrador ou tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan, index) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          index={index}
          selectedPlan={selectedPlan}
          onSelectPlan={onSelectPlan}
        />
      ))}
    </div>
  );
};
