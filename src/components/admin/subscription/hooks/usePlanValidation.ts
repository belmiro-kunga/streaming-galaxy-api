
import { SubscriptionPlan } from '@/types/api';

export const usePlanValidation = () => {
  const validatePlan = (currentPlan: Partial<SubscriptionPlan> | null) => {
    if (!currentPlan) {
      return { valid: false, error: 'Dados do plano inválidos' };
    }
    
    // Validate required fields
    if (!currentPlan.nome) {
      return { valid: false, error: 'O nome do plano é obrigatório' };
    }
    
    // Validate numeric fields
    if (currentPlan.telas_simultaneas && isNaN(Number(currentPlan.telas_simultaneas))) {
      return { valid: false, error: 'O número de telas simultâneas deve ser um número' };
    }
    
    if (currentPlan.limite_downloads && isNaN(Number(currentPlan.limite_downloads))) {
      return { valid: false, error: 'O limite de downloads deve ser um número' };
    }
    
    if (currentPlan.limite_perfis && isNaN(Number(currentPlan.limite_perfis))) {
      return { valid: false, error: 'O limite de perfis deve ser um número' };
    }
    
    if (currentPlan.precos && currentPlan.precos.length > 0) {
      const price = currentPlan.precos[0].preco;
      if (isNaN(Number(price))) {
        return { valid: false, error: 'O preço deve ser um número' };
      }
    }
    
    return { valid: true, error: null };
  };

  return { validatePlan };
};
