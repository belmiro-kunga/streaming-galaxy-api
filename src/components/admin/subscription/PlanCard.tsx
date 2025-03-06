
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash, Tv, Smartphone, Download, Users } from 'lucide-react';
import { SubscriptionPlan } from '@/types/api';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (plan: SubscriptionPlan) => void;
  onToggleStatus: (planId: string, currentStatus: boolean) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onEdit, 
  onDelete,
  onToggleStatus 
}) => {
  return (
    <Card key={plan.id} className="bg-gray-900 border-gray-800 overflow-hidden">
      <div className="flex justify-between items-start p-6 bg-gray-800">
        <div>
          <h3 className="text-xl font-medium">{plan.nome}</h3>
          <p className="text-sm text-gray-400">{plan.descricao}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={plan.ativo} 
            onCheckedChange={() => onToggleStatus(plan.id, plan.ativo)}
          />
          <Badge variant={plan.ativo ? "default" : "secondary"}>
            {plan.ativo ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <Tv className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1">Qualidade {plan.qualidade_maxima}</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1">{plan.telas_simultaneas} dispositivos</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <Download className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1">{plan.limite_downloads} downloads</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1">{plan.limite_perfis} perfis</span>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Preço</div>
          <div className="text-2xl font-bold">
            {plan.precos && plan.precos[0] ? 
              `${plan.precos[0].moeda_codigo} ${plan.precos[0].preco.toLocaleString()}` : 
              "Preço não definido"}
          </div>
          <div className="text-xs text-gray-500">{plan.ciclo_cobranca}</div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-blue-900/30 text-blue-400 border-blue-800 hover:bg-blue-900"
            onClick={() => onEdit(plan)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-red-900/30 text-red-400 border-red-800 hover:bg-red-900"
            onClick={() => onDelete(plan)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
