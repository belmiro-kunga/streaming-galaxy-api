
import React from 'react';
import { Header } from '@/components/ui/Header';
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans';
import { SubscriptionHeader } from '@/components/subscription/SubscriptionHeader';
import { PlanGrid } from '@/components/subscription/PlanGrid';
import { SubscriptionFooter } from '@/components/subscription/SubscriptionFooter';

const SubscriptionPlans = () => {
  const {
    plans,
    isLoading,
    selectedPlan,
    isLoggedIn,
    handleSelectPlan,
    handleSubscribe
  } = useSubscriptionPlans();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <SubscriptionHeader />
        
        <PlanGrid 
          plans={plans}
          selectedPlan={selectedPlan}
          onSelectPlan={handleSelectPlan}
          isLoading={isLoading}
        />
        
        <SubscriptionFooter 
          onSubscribe={handleSubscribe}
          isLoading={isLoading}
          selectedPlan={selectedPlan}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default SubscriptionPlans;
