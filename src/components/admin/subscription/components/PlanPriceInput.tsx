
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PlanPriceInputProps {
  price: number;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

const PlanPriceInput: React.FC<PlanPriceInputProps> = ({ price, onChange, isLoading }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="price">Preço (AOA)</Label>
      <Input 
        id="price" 
        type="number"
        min="0"
        value={price}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border-gray-700 text-white"
        placeholder="Preço em Kwanzas"
        disabled={isLoading}
      />
    </div>
  );
};

export default PlanPriceInput;
