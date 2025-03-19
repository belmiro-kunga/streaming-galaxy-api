
import React from 'react';
import { SubscriptionHeaderProps } from '@/types/ui';

export const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = () => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground dark:text-white">
        Escolha seu plano de assinatura
      </h1>
      <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
        Acesse todos os benefícios da plataforma com um plano que se adapta às suas necessidades.
        Cancele a qualquer momento.
      </p>
    </div>
  );
};
