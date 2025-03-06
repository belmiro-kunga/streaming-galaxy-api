
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SubscriptionPlan } from '@/types/api';

interface PlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: Partial<SubscriptionPlan> | null;
  setCurrentPlan: React.Dispatch<React.SetStateAction<Partial<SubscriptionPlan> | null>>;
  dialogMode: "add" | "edit";
  onSave: () => void;
  handlePriceChange: (value: string) => void;
}

const PlanDialog: React.FC<PlanDialogProps> = ({
  isOpen,
  onOpenChange,
  currentPlan,
  setCurrentPlan,
  dialogMode,
  onSave,
  handlePriceChange
}) => {
  if (!currentPlan) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogMode === "add" ? "Adicionar Novo Plano" : "Editar Plano"}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {dialogMode === "add" 
              ? "Preencha os dados para adicionar um novo plano de assinatura." 
              : "Atualize as informações do plano de assinatura."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input 
                id="name" 
                value={currentPlan?.nome || ""}
                onChange={(e) => setCurrentPlan({...currentPlan, nome: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: Premium, Básico, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing-cycle">Ciclo de Cobrança</Label>
              <Select 
                value={currentPlan?.ciclo_cobranca || "mensal"} 
                onValueChange={(value) => setCurrentPlan({...currentPlan, ciclo_cobranca: value})}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione o ciclo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="diário">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quinzenal">Quinzenal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input 
              id="description" 
              value={currentPlan?.descricao || ""}
              onChange={(e) => setCurrentPlan({...currentPlan, descricao: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Breve descrição do plano"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quality">Qualidade Máxima</Label>
              <Select 
                value={currentPlan?.qualidade_maxima || "HD"} 
                onValueChange={(value) => setCurrentPlan({...currentPlan, qualidade_maxima: value})}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione a qualidade" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="SD">SD</SelectItem>
                  <SelectItem value="HD">HD</SelectItem>
                  <SelectItem value="Full HD">Full HD</SelectItem>
                  <SelectItem value="Ultra HD">Ultra HD</SelectItem>
                  <SelectItem value="4K">4K</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço (AOA)</Label>
              <Input 
                id="price" 
                type="number"
                value={currentPlan?.precos?.[0]?.preco || 0}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Preço em Kwanzas"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="screens">Telas Simultâneas</Label>
              <Input 
                id="screens" 
                type="number"
                min="1"
                max="10"
                value={currentPlan?.telas_simultaneas || 1}
                onChange={(e) => setCurrentPlan({...currentPlan, telas_simultaneas: Number(e.target.value) || 1})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="downloads">Limite de Downloads</Label>
              <Input 
                id="downloads" 
                type="number"
                min="0"
                value={currentPlan?.limite_downloads || 0}
                onChange={(e) => setCurrentPlan({...currentPlan, limite_downloads: Number(e.target.value) || 0})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profiles">Limite de Perfis</Label>
              <Input 
                id="profiles" 
                type="number"
                min="1"
                max="10"
                value={currentPlan?.limite_perfis || 1}
                onChange={(e) => setCurrentPlan({...currentPlan, limite_perfis: Number(e.target.value) || 1})}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="active"
              checked={currentPlan?.ativo || false} 
              onCheckedChange={(checked) => setCurrentPlan({...currentPlan, ativo: checked})}
            />
            <Label htmlFor="active">Plano Ativo</Label>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            onClick={onSave}
            disabled={!currentPlan?.nome}
            className="bg-primary hover:bg-primary/90"
          >
            {dialogMode === "add" ? "Adicionar" : "Atualizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
