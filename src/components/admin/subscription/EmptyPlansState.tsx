
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface EmptyPlansStateProps {
  onAddPlan: () => void;
}

const EmptyPlansState: React.FC<EmptyPlansStateProps> = ({ onAddPlan }) => {
  return (
    <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
      <p className="text-gray-400">Nenhum plano de assinatura cadastrado.</p>
      <Button 
        variant="outline"
        className="mt-4"
        onClick={onAddPlan}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Plano
      </Button>
    </div>
  );
};

export default EmptyPlansState;
