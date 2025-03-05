
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProfilePinInputProps {
  initialPin?: string;
  onPinChange: (pin: string) => void;
  isKidsProfile: boolean;
}

const ProfilePinInput = ({ initialPin, onPinChange, isKidsProfile }: ProfilePinInputProps) => {
  const [pin, setPin] = useState(initialPin || '');
  const [confirmPin, setConfirmPin] = useState(initialPin || '');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Don't render PIN input for kids profiles
  if (isKidsProfile) {
    return (
      <div className="text-muted-foreground italic text-sm">
        Perfis infantis não possuem PIN de acesso
      </div>
    );
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
    setPin(newPin);
    setError('');
    
    // Auto-validate when PIN reaches 4 digits
    if (newPin.length === 4 && confirmPin.length === 4) {
      validatePins(newPin, confirmPin);
    }
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPin = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
    setConfirmPin(newConfirmPin);
    setError('');
    
    // Auto-validate when confirm PIN reaches 4 digits
    if (pin.length === 4 && newConfirmPin.length === 4) {
      validatePins(pin, newConfirmPin);
    }
  };

  const validatePins = (pin1: string, pin2: string) => {
    if (pin1 !== pin2) {
      setError('Os PINs não coincidem');
      return false;
    }
    
    if (pin1.length !== 4) {
      setError('O PIN deve ter 4 dígitos');
      return false;
    }
    
    return true;
  };

  const handleSavePin = () => {
    if (validatePins(pin, confirmPin)) {
      onPinChange(pin);
      toast({
        title: "PIN atualizado",
        description: "O PIN de acesso foi atualizado com sucesso",
      });
    } else {
      toast({
        title: "Erro ao salvar PIN",
        description: error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium mb-2">PIN de Acesso</h3>
      <div className="space-y-3">
        <div>
          <label htmlFor="pin" className="block text-sm font-medium mb-1">
            PIN (4 dígitos)
          </label>
          <div className="relative">
            <input
              id="pin"
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={handlePinChange}
              placeholder="Digite o PIN"
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={4}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmPin" className="block text-sm font-medium mb-1">
            Confirmar PIN
          </label>
          <div className="relative">
            <input
              id="confirmPin"
              type={showConfirmPin ? "text" : "password"}
              value={confirmPin}
              onChange={handleConfirmPinChange}
              placeholder="Confirme o PIN"
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={4}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPin(!showConfirmPin)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {error && <p className="text-destructive text-sm">{error}</p>}
        
        <Button 
          type="button" 
          onClick={handleSavePin}
          disabled={pin.length !== 4 || confirmPin.length !== 4}
          className="w-full"
        >
          Salvar PIN
        </Button>
      </div>
    </div>
  );
};

export default ProfilePinInput;
