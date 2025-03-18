
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BillingCycleSelectProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

const BillingCycleSelect: React.FC<BillingCycleSelectProps> = ({ value, onChange, isLoading }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="billing-cycle">Ciclo de Cobrança</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoading}
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
  );
};

export default BillingCycleSelect;
