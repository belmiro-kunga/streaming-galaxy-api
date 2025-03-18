
import React from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QualitySelectProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

const QualitySelect: React.FC<QualitySelectProps> = ({ value, onChange, isLoading }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="quality">Qualidade Máxima</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoading}
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
  );
};

export default QualitySelect;
