
import { useState } from 'react';
import { SubscriptionPlan } from '@/types/api';

export const usePlanDialog = () => {
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<SubscriptionPlan> | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [formError, setFormError] = useState<string | null>(null);
  
  const addPlan = () => {
    setFormError(null);
    setDialogMode("add");
    setCurrentPlan({
      nome: "",
      descricao: "",
      qualidade_maxima: "HD",
      telas_simultaneas: 1,
      limite_downloads: 10,
      limite_perfis: 1,
      ciclo_cobranca: "mensal",
      ativo: true,
      precos: [{ 
        moeda_codigo: "AOA", 
        preco: 0,
        plano_id: `temp-${Date.now()}`
      }]
    });
    setIsPlanDialogOpen(true);
  };
  
  const editPlan = (plan: SubscriptionPlan) => {
    setFormError(null);
    setDialogMode("edit");
    setCurrentPlan({ ...plan });
    setIsPlanDialogOpen(true);
  };
  
  const handlePriceChange = (value: string) => {
    if (!currentPlan || !currentPlan.precos || currentPlan.precos.length === 0) return;
    
    const precos = [...currentPlan.precos];
    const planId = currentPlan.id || `temp-${Date.now()}`;
    
    precos[0] = { 
      ...precos[0], 
      preco: Number(value) || 0,
      plano_id: precos[0].plano_id || planId
    };
    
    setCurrentPlan({
      ...currentPlan,
      precos
    });
  };
  
  return {
    isPlanDialogOpen,
    setIsPlanDialogOpen,
    currentPlan,
    setCurrentPlan,
    dialogMode,
    formError,
    setFormError,
    addPlan,
    editPlan,
    handlePriceChange
  };
};
