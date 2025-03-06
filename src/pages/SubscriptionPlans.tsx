
import React from 'react';
import { Header } from '@/components/ui/Header';
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans';
import { SubscriptionHeader } from '@/components/subscription/SubscriptionHeader';
import { PlanGrid } from '@/components/subscription/PlanGrid';
import { SubscriptionFooter } from '@/components/subscription/SubscriptionFooter';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100">
      <Header />
      
      <div className="absolute top-4 right-24">
        <ThemeToggle />
      </div>
      
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
