import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlan } from '@/types/api';
import { Loader2, AlertTriangle } from 'lucide-react';
import PlanPriceInput from './components/PlanPriceInput';
import BillingCycleSelect from './components/BillingCycleSelect';
import QualitySelect from './components/QualitySelect';
import PlanLimitsInputs from './components/PlanLimitsInputs';
import { PlanDialogProps } from '@/services/plans/types';

const PlanDialog: React.FC<PlanDialogProps> = ({
  isOpen,
  onOpenChange,
  currentPlan,
  setCurrentPlan,
  dialogMode,
  onSave,
  handlePriceChange,
  isLoading = false,
  formError = null
}) => {
  if (!isOpen || !currentPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isLoading) {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogMode === "add" ? "Adicionar Novo Plano" : "Editar Plano"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {dialogMode === "add" 
              ? "Preencha os dados para adicionar um novo plano de assinatura." 
              : "Atualize as informações do plano de assinatura."}
          </DialogDescription>
        </DialogHeader>
        
        {formError && (
          <div className="bg-red-900/30 border border-red-600 rounded-md p-3 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-200 text-sm">{formError}</p>
          </div>
        )}
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Plano*</Label>
              <Input 
                id="name" 
                value={currentPlan?.nome || ""}
                onChange={(e) => setCurrentPlan({...currentPlan, nome: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: Premium, Básico, etc."
                disabled={isLoading}
                required
              />
            </div>
            
            <BillingCycleSelect
              value={currentPlan?.ciclo_cobranca || "mensal"}
              onChange={(value) => setCurrentPlan({...currentPlan, ciclo_cobranca: value})}
              isLoading={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input 
              id="description" 
              value={currentPlan?.descricao || ""}
              onChange={(e) => setCurrentPlan({...currentPlan, descricao: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Breve descrição do plano"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QualitySelect
              value={currentPlan?.qualidade_maxima || "HD"}
              onChange={(value) => setCurrentPlan({...currentPlan, qualidade_maxima: value})}
              isLoading={isLoading}
            />
            
            <PlanPriceInput
              price={currentPlan?.precos?.[0]?.preco || 0}
              onChange={handlePriceChange}
              isLoading={isLoading}
            />
          </div>
          
          <PlanLimitsInputs
            screens={currentPlan?.telas_simultaneas || 1}
            downloads={currentPlan?.limite_downloads || 0}
            profiles={currentPlan?.limite_perfis || 1}
            onScreensChange={(value) => setCurrentPlan({...currentPlan, telas_simultaneas: value})}
            onDownloadsChange={(value) => setCurrentPlan({...currentPlan, limite_downloads: value})}
            onProfilesChange={(value) => setCurrentPlan({...currentPlan, limite_perfis: value})}
            isLoading={isLoading}
          />
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="active"
              checked={currentPlan?.ativo || false} 
              onCheckedChange={(checked) => setCurrentPlan({...currentPlan, ativo: checked})}
              disabled={isLoading}
            />
            <Label htmlFor="active">Plano Ativo</Label>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            onClick={onSave}
            disabled={!currentPlan?.nome || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {dialogMode === "add" ? "Adicionando..." : "Atualizando..."}
              </>
            ) : (
              dialogMode === "add" ? "Adicionar" : "Atualizar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
