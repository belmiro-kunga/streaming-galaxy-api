
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
