
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SubscriptionPlan } from '@/types/api';

interface SubscriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: any;
  selectedSubscription: string;
  setSelectedSubscription: (subscription: string) => void;
  subscriptionPlans: SubscriptionPlan[];
  handleSave: () => void;
}

const SubscriptionDialog = ({
  isOpen,
  onOpenChange,
  currentUser,
  selectedSubscription,
  setSelectedSubscription,
  subscriptionPlans,
  handleSave
}: SubscriptionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Gerenciar Assinatura</DialogTitle>
          <DialogDescription className="text-gray-400">
            Atualize o plano de assinatura do usuário {currentUser?.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subscription">Plano de Assinatura</Label>
            <Select 
              value={selectedSubscription} 
              onValueChange={setSelectedSubscription}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="">Sem assinatura</SelectItem>
                {subscriptionPlans.map(plan => (
                  <SelectItem key={plan.id} value={plan.nome}>
                    {plan.nome} - {plan.precos?.[0]?.preco ? `AOA ${plan.precos[0].preco.toLocaleString()}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedSubscription && subscriptionPlans.find(p => p.nome === selectedSubscription) && (
            <div className="bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium mb-2">Detalhes do plano:</h4>
              {(() => {
                const plan = subscriptionPlans.find(p => p.nome === selectedSubscription);
                if (!plan) return null;
                return (
                  <div className="text-sm space-y-1 text-gray-300">
                    <p>{plan.descricao}</p>
                    <p>Qualidade máxima: {plan.qualidade_maxima}</p>
                    <p>Telas simultâneas: {plan.telas_simultaneas}</p>
                    <p>Limite de downloads: {plan.limite_downloads}</p>
                    <p>Limite de perfis: {plan.limite_perfis}</p>
                    <p className="font-medium text-primary">
                      Preço: {plan.precos?.[0]?.preco ? `AOA ${plan.precos[0].preco.toLocaleString()}` : ""}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
          >
            Atualizar Assinatura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
