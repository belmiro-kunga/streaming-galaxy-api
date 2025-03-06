
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionFooterProps {
  onSubscribe: () => void;
  isLoading: boolean;
  selectedPlan: string | null;
  isLoggedIn: boolean;
}

export const SubscriptionFooter = ({ 
  onSubscribe, 
  isLoading, 
  selectedPlan, 
  isLoggedIn 
}: SubscriptionFooterProps) => {
  return (
    <div className="mt-12 text-center">
      <Button 
        size="lg" 
        onClick={onSubscribe}
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
  );
};
