
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PinDialogProps {
  isChangingPin: boolean;
  pinData: { pin: string; confirmPin: string };
  pinError: string;
  onPinDataChange: (data: { pin: string; confirmPin: string }) => void;
  onSavePin: () => void;
  onCancel: () => void;
}

export const PinDialog: React.FC<PinDialogProps> = ({
  isChangingPin,
  pinData,
  pinError,
  onPinDataChange,
  onSavePin,
  onCancel
}) => {
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    onPinDataChange({ ...pinData, pin: value });
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    onPinDataChange({ ...pinData, confirmPin: value });
  };

  return (
    <DialogContent className="bg-gray-900 text-white border-gray-800">
      <DialogHeader>
        <DialogTitle>{isChangingPin ? "Alterar PIN" : "Definir PIN"}</DialogTitle>
        <DialogDescription className="text-gray-400">
          {isChangingPin 
            ? "Altere o PIN para este perfil." 
            : "Defina um PIN para proteger este perfil."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="pin">PIN (apenas números)</Label>
          <Input 
            id="pin" 
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pinData.pin} 
            onChange={handlePinChange}
            className="bg-gray-800 border-gray-700"
            placeholder="Digite um PIN de 4 a 6 dígitos"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="confirm-pin">Confirmar PIN</Label>
          <Input 
            id="confirm-pin" 
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pinData.confirmPin} 
            onChange={handleConfirmPinChange}
            className="bg-gray-800 border-gray-700"
            placeholder="Confirme o PIN"
          />
        </div>
        {pinError && (
          <div className="text-red-500 text-sm mt-1">
            {pinError}
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="border-gray-700 hover:bg-gray-800">
          Cancelar
        </Button>
        <Button onClick={onSavePin}>Salvar PIN</Button>
      </DialogFooter>
    </DialogContent>
  );
};
