
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SubscriptionFooterProps } from '@/types/ui';

export const SubscriptionFooter = ({
  onSubscribe,
  isLoading,
  selectedPlan,
  isLoggedIn
}: SubscriptionFooterProps) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (selectedPlan) {
      onSubscribe();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 animate-fade-in">
      <Button
        onClick={handleAction}
        disabled={isLoading || !selectedPlan}
        className="px-8 py-6 text-lg bg-primary dark:bg-violet-500 hover:bg-primary/90 dark:hover:bg-violet-600 text-primary-foreground dark:text-white"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando...
          </span>
        ) : !isLoggedIn ? (
          'Fazer login para continuar'
        ) : !selectedPlan ? (
          'Selecione um plano'
        ) : (
          'Continuar para pagamento'
        )}
      </Button>
      
      <p className="mt-6 text-sm text-muted-foreground dark:text-gray-400 max-w-lg text-center">
        Ao assinar, você concorda com os nossos Termos de Serviço e Política de Privacidade.
        Você poderá cancelar sua assinatura a qualquer momento.
      </p>
    </div>
  );
};
